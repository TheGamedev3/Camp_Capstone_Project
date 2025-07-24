type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type GetRouteArgs = {
  route: string; // e.g. "POST /login"
  body?: any;
};

type APIResponse<T = any> =
  | { success: true; result: T }
  | { success: false; error?: string; errCode?: number };

export async function getRoute<T = any>({
  route,
  body,
}: GetRouteArgs): Promise<APIResponse<T>> {
  const [method, path] = route.trim().split(" ") as [HTTPMethod, string];

  if (!method || !path) {
    return {
      success: false,
      error: "Invalid route format. Expected format: 'METHOD /path'",
    };
  }

  try {
    const res = await fetch(path, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
    });
    console.log(method)

    const fullResult = await res.json(); // returned as {success:true/false, result, err}

    if (!res.ok) {
      return {
        success: false,
        result: fullResult,
        err:{msg:'request failed!', errCode: res.status},
      };
    }

    return fullResult;
  } catch (err: any) {
    return {
      success: false,
      err,
    };
  }
}
