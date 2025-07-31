import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateQueue = useRef<Record<string, string | boolean | number | null>>({});
  const updateTimer = useRef<NodeJS.Timeout | null>(null);

  const flushParams = () => {
    const url = new URL(window.location.href);                  // ✅ live URL
    const current = new URLSearchParams(url.search);            // ✅ accurate, up-to-date

    for (const [key, value] of Object.entries(updateQueue.current)) {
      if (value === null || value === "") current.delete(key);
      else current.set(key, String(value));
    }

    updateQueue.current = {}; // clear queue

    const newSearch = current.toString();
    if (url.search === `?${newSearch}`) return;

    url.search = newSearch;
    router.push(url.toString(), { scroll: false });
  };

  const setParam = useCallback(
    (key: string, value: string | boolean | number | null) => {
      updateQueue.current[key] = value;
      if (updateTimer.current) clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(flushParams, 10);
    },
    [router]
  );

  const setParams = (updates: Record<string, string | boolean | number | null>) => {
    for (const [key, value] of Object.entries(updates)) {
      updateQueue.current[key] = value;
    }
    if (updateTimer.current) clearTimeout(updateTimer.current);
    updateTimer.current = setTimeout(flushParams, 10);
  };

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
    setParam,
    setParams,
    paramSetter,
  };
}
