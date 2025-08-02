
import{ DEFAULT_TIMEOUT, INTERVAL } from './SiteEnv';

import { ExpectationFailed } from './Errs';

/** internal polling helper */
export async function waitUntil(
  tester: () => Promise<boolean>,
  onFail: () => Promise<string> | string,
  expectSuccess = true,
  timeout = DEFAULT_TIMEOUT,
) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if ((await tester()) === expectSuccess) return; // ✅ done
    await this.page.waitForTimeout(INTERVAL);
  }

  const errMsg = onFail ? await onFail() : 'Expectation timed-out after ' + timeout + ' ms';
  throw new ExpectationFailed(errMsg, 2);
}


/** ExpectTextIn('[name="pages"]', /Page\s*2\s*of\s*3/) */
export async function ExpectTextIn(
  selector: string,
  textOrRegex: string | RegExp,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  var content;
  await this.waitUntil(
    async () => {
      content = await this.page.locator(selector).textContent();
      if (!content) return false;

      return typeof textOrRegex === 'string'
        ? content.includes(textOrRegex)
        : textOrRegex.test(content);
    },
    ()=>{
      const expecting = textOrRegex.toString();
      if(!content)content = `(${selector} element not found)`;
      if(success){
        return `${expecting} NOT FOUND IN: ${selector}\nafter ⏱️   ${timeout} ms`;
      }else{
        return `${expecting} WAS STILL IN: ${selector}\nafter ⏱️   ${timeout} ms`;
      }
    },
    success, timeout
  );
}


/** ExpectElement("text=Ryan") */
export async function ExpectElement(
  selector: string,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  var matches = 0;
  await this.waitUntil(
    async () => {
      matches = await this.page.locator(selector).count();
      return (matches) > 0;
    },
    ()=>{
      if(success){
        return `FOUND ${matches} MATCHES FOR ${selector}\nafter ⏱️   ${timeout} ms`;
      }else{
        return `UNEXPECTEDLY FOUND ${matches} MATCHES FOR ${selector}\nafter ⏱️   ${timeout} ms`;
      }
    },
    success, timeout
  );
}

/** General condition checker on a single element */
export async function ExpectElementTo<ElementType extends Element>(
  selector: string,
  condition: (el: ElementType) => boolean,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  let el: ElementHandle<ElementType> | null = null;

  await this.waitUntil(
    async () => {
      el = await this.page.locator(selector).elementHandle();
      return el
        ? await el.evaluate(condition as (e: Element) => boolean)
        : false;
    },
    ()=>{
      const expecting = condition.toString();
      const element = el ? `(${selector} ${el.toString()})` : `(${selector} (not found))`
      if(success){
        return `${expecting} DIDNT APPLY TO: ${element}\nafter ⏱️   ${timeout} ms`;
      }else{
        return `${expecting} UNEXPECTEDLY APPLIED TO: ${element}\nafter ⏱️   ${timeout} ms`;
      }
    },
    success, timeout
  );
}

/** ExpectText("LOGIN")  or  ExpectText(["Login","Profile"]) */
export async function ExpectText(
  text: string | (string | RegExp)[],
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  // Normalise to an array
  const needles = Array.isArray(text) ? text : [text];
  if(needles.length === 0)return true;

  var body;
  await this.waitUntil(
    async () => {
      body = await this.page.textContent('body');
      if (!body) return false;

      // All needles must satisfy the presence test
      return needles.every((needle) =>
        typeof needle === 'string'
          ? body.includes(needle)
          : needle.test(body)
      );
    },
    ()=>{
      const expecting = `[${needles.join(', ')}]`;
      if(!body)body = `(page body not found)`;
      if(success){
        return `${expecting} NOT FOUND IN: ${body}\nafter ⏱️   ${timeout} ms`;
      }else{
        return `${expecting} WAS STILL IN: ${body}\nafter ⏱️   ${timeout} ms`;
      }
    },
    success, timeout
  );
}


/** ExpectHeader("LOGIN") – searches <h*> and ARIA headings */
export async function ExpectHeader(
  heading: string,
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  let tagCount = 0;
  let roleCount = 0;

  await this.waitUntil(
    async () => {
      const tagMatch  = this.page.locator('h1,h2,h3,h4,h5,h6', { hasText: heading });
      const roleMatch = this.page.getByRole('heading', { name: heading });

      tagCount  = await tagMatch.count();
      roleCount = await roleMatch.count();
      return tagCount + roleCount > 0;
    },
    () => {
      const total = tagCount + roleCount;
      return success
        ? `"${heading}" NOT FOUND – counts(tag:${tagCount}, role:${roleCount}) ⏱️   ${timeout} ms`
        : `"${heading}" WAS STILL PRESENT – counts(tag:${tagCount}, role:${roleCount}) ⏱️$   {timeout} ms`;
    },
    success,
    timeout
  );
}

/** ExpectUrl('/players', { onlineOnly: 'true' }) */
export async function ExpectUrl(
  pathOrRE: string | RegExp,
  params: Record<string, string | number | boolean> = {},
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  let current: URL;

  await this.waitUntil(
    async () => {
      current = new URL(await this.page.url());
      const pathOK =
        typeof pathOrRE === 'string'
          ? current.pathname === pathOrRE
          : pathOrRE.test(current.pathname);

      const paramsOK = Object.entries(params).every(
        ([k, v]) => (current.searchParams.get(k) || '') === String(v)
      );

      return pathOK && paramsOK;
    },
    () => {
      const wantPath = typeof pathOrRE === 'string' ? pathOrRE : pathOrRE.toString();
      const wantQS   = JSON.stringify(params);
      const haveQS   = current ? current.search : '(no url)';
      return success
        ? `URL EXPECTED path=${wantPath} params=${wantQS}\nFOUND ${current?.href}\n⏱️   ${timeout} ms`
        : `URL UNEXPECTEDLY MATCHED path=${wantPath} params=${wantQS}\n⏱️   ${timeout} ms`;
    },
    success,
    timeout
  );
}

/** ExpectUrlToChange() – any part of the URL may change */
export async function ExpectUrlToChange(
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  const original = await this.page.url();
  let latest = original;

  await this.waitUntil(
    async () => {
      latest = await this.page.url();
      return latest !== original;
    },
    () => {
      return success
        ? `URL DID NOT CHANGE (still ${latest}) ⏱️   ${timeout} ms`
        : `URL CHANGED from ${original} → ${latest} ⏱️   ${timeout} ms`;
    },
    success,
    timeout
  );
}

/** ExpectRouteToChange() – only pathname difference matters */
export async function ExpectRouteToChange(
  success = true,
  timeout = DEFAULT_TIMEOUT
) {
  const originalPath = new URL(await this.page.url()).pathname;
  let latestPath = originalPath;

  await this.waitUntil(
    async () => {
      latestPath = new URL(await this.page.url()).pathname;
      return latestPath !== originalPath;
    },
    () => {
      return success
        ? `ROUTE DID NOT CHANGE (still ${latestPath}) ⏱️   ${timeout} ms`
        : `ROUTE CHANGED from ${originalPath} → ${latestPath} ⏱️   ${timeout} ms`;
    },
    success,
    timeout
  );
}
