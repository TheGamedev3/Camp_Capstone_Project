
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
            const link = page.locator(`a:has(span:has-text("${label}"))`);
            await link.waitFor({ state: 'visible' }); // Ensure it’s not hidden
            await link.click({ trial: true });        // Sanity-check it’s clickable
            await link.click();                       // Actual click
            await page.waitForTimeout(300);           // Allow client-side route to update
        },

        IsRoute: async (path: string, success: boolean) => {
            const currentPath = await page.url();
            return (currentPath === path) === success;
        },

        SetCheckbox: async (label: string, checked: boolean) => {
            await page.check(`input[type="checkbox"][value="${label}"]`, { checked });
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
