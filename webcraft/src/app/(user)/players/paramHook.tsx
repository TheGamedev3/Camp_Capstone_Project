import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setParams = (updates: Record<string, string | boolean | number | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    const preString = current.toString();
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") current.delete(key);
      else current.set(key, String(value));
    }
    if(preString === current){return}
    router.push(`?${current.toString()}`, { scroll: false });
  };

  const setParam = useCallback(
    (key: string, value: string | boolean | number | null) => {
      const current = new URLSearchParams(searchParams.toString());
      const preString = current.toString();

      if (value === null || value === "") current.delete(key);
      else current.set(key, String(value));

      if(preString === current){return}
      const newQuery = current.toString();
      router.push(`?${newQuery}`, { scroll: false });
    },
    [searchParams, router]
  );

  const paramSetter = (param: string, kind: "value" | "checked" = "value") => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (kind === "value") {
        setParam(param, e.target.value);
      } else if (kind === "checked") {
        setParam(param, (e.target as HTMLInputElement).checked);
      }
    };
  };

  return {
    getParam: (key: string) => searchParams.get(key),
    queryString: searchParams.toString(),

    setParam, setParams, paramSetter,
  };
}
