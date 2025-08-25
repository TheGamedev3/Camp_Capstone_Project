type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type GetRouteArgs = {
  route: string; // e.g. "POST /login"
  body?: Record<string, unknown>;
  page?: any;
};

type APIResponse<T = unknown> =
  | { success: true; result: T | undefined | null }
  | { success: false; result: undefined | null, error?: string; errCode?: number };

export async function getRoute<T = unknown>({
  route,
  body = {},
  page = null,
}: GetRouteArgs): Promise<APIResponse<T>> {
  const [method, path] = route.trim().split(" ") as [HTTPMethod, string];

  if (!method || !path) {
    return {
      success: false,
      error: "Invalid route format. Expected format: 'METHOD /path'",
    };
  }

  
  try {
    const res = !page
      ? await fetch(path, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        ...(method !== "GET" && { body: JSON.stringify({...body, claim: Date.now()}) }),
      }):
      await page.request[method.toLowerCase()](path,{data:{...body, claim: Date.now()}});

    console.log(method)

    const fullResult = await res.json();
    // expected response is {success:true/false, result, err}, if its working correctly

    if (!res.ok) {
      return {
        success: false,
        result: fullResult,
        err:{msg:'request failed!', errCode: res.status},
      };
    }

    return fullResult;
  } catch (err: unknown) {
    return {
      success: false,
      err,
    };
  }
}

