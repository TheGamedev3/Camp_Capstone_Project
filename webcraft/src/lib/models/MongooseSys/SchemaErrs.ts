
/*

Requires extra code to make all the errors cached, global
because the script by default is run dynamically/separately,
so one script requiring it may have an err7 while another may not
globalThis is used to fix this

*/


// Store error codes
type MongoErrorCode = { field: string; message: string; id: string; int_id: number };

// Define global cache type
type GlobalMongoErrCache = {
  codesByKey: Record<string, MongoErrorCode>;
  codesById: Record<number, MongoErrorCode>;
  uniqueId: number;
};

// Initialize global cache if it doesn't exist
const globalCache: GlobalMongoErrCache = (globalThis as any).__MONGO_ERROR_CACHE__ ?? {
  codesByKey: {},
  codesById: {},
  uniqueId: 0,
};

// Attach cache to globalThis to persist across reloads
(globalThis as any).__MONGO_ERROR_CACHE__ = globalCache;

const codesByKey = globalCache.codesByKey;
const codesById = globalCache.codesById;

/**
 * Create and store a unique mongo error code.
 * Returns an existing code if the same field+message pair was already registered.
 */
export function mongoErr(field: string, message: string): MongoErrorCode {
  const key = `${field}__${message}`;
  let errObject = codesByKey[key];

  if (!errObject) {
    globalCache.uniqueId++;
    errObject = {
      field,
      message,
      int_id: globalCache.uniqueId,
      id: `[mongoErr${globalCache.uniqueId}]`,
    };
    codesByKey[key] = errObject;
    codesById[globalCache.uniqueId] = errObject;
  }

  return errObject;
}

type ErrorResult = Record<string, string> & { matches: number };

/**
 * Parse error messages and return detected errors as { field: message } plus a matches count.
 */
export function getErrs(errMsg: string): ErrorResult {
  const result: ErrorResult = { matches: 0 };
  const seen = new Set<number>();

  const matcher = errMsg.matchAll(/\[mongoErr(\d+)\]/g);
  for (const match of matcher) {
    const int_id = Number(match[1]);
    if (seen.has(int_id)) continue;
    seen.add(int_id);

    const code = codesById[int_id];
    if (code) {
      result[code.field] = code.message;
      result.matches++;
    }
  }

  return result;
}

/**
 * Attempts a request and catches errors with mongoErr tags.
 */
export async function attemptRequest(
  func: () => Promise<Record<string, string>>
) {
  try {
    return await func();
  } catch (err: any) {
    const message = err?.message || "";
    console.log("ERR OCCURED:", message);

    const errObject = getErrs(message);
    if (errObject.matches === 0) {
      errObject.server = "Internal Server Err 500";
      console.warn(err);
    }

    return { success: false, err: errObject };
  }
}
