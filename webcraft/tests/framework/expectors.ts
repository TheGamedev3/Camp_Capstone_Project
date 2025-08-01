
import{ DEFAULT_TIMEOUT, INTERVAL } from './SiteEnv';

/** internal polling helper */
export async function waitUntil(
  tester: () => Promise<boolean>,
  expectSuccess = true,
  timeout = DEFAULT_TIMEOUT
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if ((await tester()) === expectSuccess) return;       // ✅ done
    await this.page.waitForTimeout(INTERVAL);
  }
  throw new Error('Expectation timed-out after ' + timeout + ' ms');
}

/** ExpectTextIn('[name="pages"]', /Page\s*2\s*of\s*3/) */
export async function ExpectTextIn(
  selector: string,
  textOrRegex: string | RegExp,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    const content = await this.page.locator(selector).textContent();
    if (!content) return false;

    return typeof textOrRegex === 'string'
      ? content.includes(textOrRegex)
      : textOrRegex.test(content);
  }, success, timeout);
}


/** ExpectElement("text=Ryan") */
export async function ExpectElement(
  selector: string,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    return (await this.page.locator(selector).count()) > 0;
  }, success, timeout);
}

/** General condition checker on a single element */
export async function ExpectElementTo<ElementType extends Element>(
  selector: string,
  condition: (el: ElementType) => boolean,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    const el = await this.page.locator(selector).elementHandle();
    return el
      ? await el.evaluate(condition as (e: Element) => boolean)
      : false;
  }, success, timeout);
}

/** ExpectText("LOGIN") – scans full body text */
export async function ExpectText(
  text: string,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    const body = await this.page.textContent('body');
    return body?.includes(text) ?? false;
  }, success, timeout);
}

/** ExpectHeader("LOGIN") – searches <h*> and ARIA headings */
export async function ExpectHeader(
  heading: string,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    const tagMatch = this.page.locator('h1,h2,h3,h4,h5,h6', {
      hasText: heading,
    });

    const roleMatch = this.page.getByRole('heading', { name: heading });

    return (await tagMatch.count()) > 0 || (await roleMatch.count()) > 0;
  }, success, timeout);
}

/** ExpectUrl('/players', { onlineOnly: 'true' }) */
export async function ExpectUrl(
  pathOrRE: string | RegExp,
  params: Record<string, string | number | boolean> = {},
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  await this.waitUntil(async () => {
    const url = new URL(await this.page.url());
    const pathOK =
      typeof pathOrRE === 'string'
        ? url.pathname === pathOrRE
        : pathOrRE.test(url.pathname);

    const paramsOK = Object.entries(params).every(([k, v]) =>
      (url.searchParams.get(k) || '') === String(v)
    );

    return pathOK && paramsOK;
  }, success, timeout);
}

/** ExpectUrlToChange() – any part of the URL may change */
export async function ExpectUrlToChange(
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  const original = await this.page.url();
  await this.waitUntil(async () => {
    return (await this.page.url()) !== original;
  }, success, timeout);
}

/** ExpectRouteToChange() – only pathname difference matters */
export async function ExpectRouteToChange(
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  const originalPath = new URL(await this.page.url()).pathname;
  await this.waitUntil(async () => {
    const currentPath = new URL(await this.page.url()).pathname;
    return currentPath !== originalPath;
  }, success, timeout);
}

export async function Batch(...promises: Promise<any>[]) {
  await Promise.all(promises);
}
