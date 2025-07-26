import { error } from "console";

// Store error codes
type MongoErrorCode = { field: string; message: string; id: string; int_id: number };
const codes: Record<string, MongoErrorCode> = {};

let uniqueId = 0;

/**
 * Create and store a unique mongo error code
 */
export function mongoErr(field: string, message: string): MongoErrorCode {
  const index = field+'_'+message;
  let errObject = codes[field+'_'+message];
  if(!errObject){
    uniqueId++;
    errObject = { field, message, int_id: uniqueId, id: `[mongoErr${uniqueId}]` };
    codes[index] = errObject;
  }
  return errObject;
}

type ErrorResult = Record<string, string> & { matches: number };

/**
 * Parse error messages and return detected errors as { field: message }
 */
export function getErrs(errMsg: string): Record<string, string> {
  const result: ErrorResult = { matches: 0 };

  // Find all `[mongoErr<number>]` tags in the errMsg
  const matcher = errMsg.matchAll(/\[mongoErr(\d+)\]/g);
  for (const match of matcher) {
    const int_id = parseInt(match[1], 10);
    const code = Object.values(codes).find(c => c.int_id === int_id);
    if(code){result[code.field] = code.message; result.matches++}
  }
  return result;
}

export async function attemptRequest(func: () => Promise<Record<string, string>>) {
  try {
    return await func();
  } catch (err: any) {
    const message = err.message || "";
    const errObject = getErrs(message);
    if(errObject.matches === 0){
        errObject.server = "Internal Server Err 500";
        console.warn(err);
    }
    return{ success: false, err: errObject };
  }
}

