
import { test } from '@playwright/test';
export { expect } from '@playwright/test';

function Helpers({ page }){
    return{
        UserSession: (username: string) => {
            //if (username) {
            //  login(username);
            //} else {
            //  goToLoginPage();
            //}
        },

        briefPause: async(pause: number = 300)=>{await page.waitForTimeout(pause)},

        HasText: async (text: string, success: boolean = true) => {
            const pageText = await page.textContent('body');
            return pageText.includes(text) === success;
        },

        UponError: (fn: Function) => {
            try {
                return fn();
            } catch (err) {
                console.error('Error occurred at line:', new Error().stack);
                throw err;
            }
        },

        Forum: async (forumName, fields) => {
            const scope = `[data-forum="${forumName}"]`;

            for (const [field, value] of Object.entries(fields)) {
                await page.fill(`${scope} input[name="${field}"]`, value);
            }
        },

        Submit: async (forumName) => {
            const scope = `[data-forum="${forumName}"]`;
            await page.click(`${scope} button[name="${forumName}-submit"]`);
            await page.waitForLoadState('networkidle');
        },

        Click: async(label: string) => {
            await page.click(`button:has-text("${label}")`);
            await page.waitForLoadState('networkidle');
        },

        ClickNav: async (label: string) => {
            const selector = [
                `a[name="${label}"]`,            // PlayerIcon links, they also end with -icon
                `a:has(span:has-text("${label}"))`, // for the header navigation link
            ].join(', ');

            const link = page.locator(selector).first();      // de-dupe if >1 match
            await link.waitFor({ state: 'visible' });
            await link.click({ trial: true });                // sanity-check
            await link.click();                               // real click
            await page.waitForLoadState('networkidle');
        },

        IsRoute: async (path: string | RegExp, success: boolean) => {
            const currentPath = new URL(await page.url()).pathname;

            const matches = typeof path === 'string'
                ? currentPath === path
                : path.test(currentPath);

            return matches === success;
        },

        SetCheckbox: async (label: string, checked: boolean) => {
            const input = page.locator(`input[type="checkbox"][name="${label}"]`);

            const isChecked = await input.isChecked();
            if (isChecked !== checked) {
                await input.click(); // click to trigger React's onChange
                await page.waitForLoadState('networkidle'); // let any re-renders settle
            }
        },

        SetText: async (fields) => {
            for (const [field, value] of Object.entries(fields)) {
                const input = page.locator(`input[name="${field}"]`);
                await input.fill('');         // clear first
                await input.type(value);      // type to trigger React onChange
            }
            await page.waitForLoadState('networkidle');
        },

        SetOption: async (selection: string, option: string) => {
            await page.selectOption(`select[name="${selection}"]`, option);
            await page.waitForLoadState('networkidle');
        },

        Batch: async(promises)=>{
            await Promise.all([
                ...promises
            ]);
        }

    }
}

export function TEST(title, func) {
  test(title, async ({ browser }) => {

    // produce the amount of user instances needed
    const users = await Promise.all(
        Array.from({ length: func.length }).map(async () => {
            const context = await browser.newContext();
            const page = await context.newPage();
            return { page, ...Helpers({ page }) };
        })
    );
    await func(...users);
  });
}
