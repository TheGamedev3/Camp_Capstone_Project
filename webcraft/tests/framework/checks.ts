
export async function IsRoute(path: string | RegExp, success: boolean) {
  const currentPath = new URL(await this.page.url()).pathname;

  const matches = typeof path === 'string'
    ? currentPath === path
    : path.test(currentPath);

  return matches === success;
}

export async function Batch(...promises: Promise<any>[]) {
  await Promise.all(promises);
}

export async function briefPause(pause: number = 300) {
  await this.page.waitForTimeout(pause);
}

export async function HasText(text: string, success: boolean = true) {
  const pageText = await this.page.textContent('body');
  return pageText.includes(text) === success;
}

export function UponError(fn: Function) {
  try {
    return fn();
  } catch (err) {
    console.error('Error occurred at line:', new Error().stack);
    throw err;
  }
}
