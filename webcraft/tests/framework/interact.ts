
import{ DEFAULT_TIMEOUT } from './SiteEnv';

/** Click a button by label, after polling until visible */
export async function Click(label: string) {
  const selector = `button:has-text("${label}")`;

  await this.waitUntil(async () => {
    return (await this.page.locator(selector).count()) > 0;
  });

  await this.page.click(selector);
  await this.page.waitForLoadState('networkidle');
}

/** Hover over an element by its `name` attribute (e.g. div, button, etc.) */
export async function Hover(
  targetName: string,
  timeout = DEFAULT_TIMEOUT
) {
  const selector = `[name="${targetName}"]`;

  await this.waitUntil(async () => {
    return (await this.page.locator(selector).count()) > 0;
  });

  await this.page.hover(selector);
}
