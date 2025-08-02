export class ExpectationFailed extends Error {
  constructor(message: string, traceLevel = 2) {
    super(message);
    this.name = "🛑 Expectation Failed";
    // Optional: Adjust stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExpectationFailed);
    }
    this.stack = cleanStack(this.stack || "", traceLevel);
  }
}

function cleanStack(stack: string, traceLevel: number): string {
  const lines = stack.split("\n");
  return [
    lines[0], // message
    ...lines.slice(traceLevel + 1) // trim irrelevant internal calls
  ].join("\n");
}

export async function expectationCatcher(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExpectationFailed) {
      const source = getErrorSource(err.stack || "");
      console.error(`${err.name}: ${err.message}`);
      if (source) {
        console.error(`🪵 ${path.basename(source.file)}:${source.line} → ${source.code}`);
      }
      throw{};
    } else {
      throw err;
    }
  }
}

import fs from 'fs';
import path from 'path';

function getErrorSource(stack: string) {
  const lines = stack.split("\n");
  const traceLine = lines.find(line => line.includes('.ts') || line.includes('.js'));
  if (!traceLine) return null;

  const match = traceLine.match(/\((.*):(\d+):(\d+)\)/) || traceLine.match(/at (.*):(\d+):(\d+)/);
  if (!match) return null;

  const [, file, lineStr] = match;
  const line = parseInt(lineStr, 10);
  if (!fs.existsSync(file)) return null;

  const content = fs.readFileSync(file, 'utf-8').split("\n");
  return {
    file,
    line,
    code: content[line - 1]?.trim()
  };
}
