
import { test } from '@playwright/test';
export { expect } from '@playwright/test';

import * as expectors from './expectors'
import * as checks from './checks' // ❌
import * as forum from './forum'
import * as interact from './interact'
import * as setters from './setters'
import * as setups from './setups'

function Helpers({ page }){
    const toolbox = {
        page,
        ...expectors,
        ...checks,
        ...forum,
        ...interact,
        ...setters,
        ...setups,
    }

    const boundHelpers = Object.fromEntries(
        Object.entries(toolbox).map(([k, v]) => [
            k,
            typeof v === 'function' ? v.bind(toolbox) : v
        ])
    );
    return boundHelpers;
}

export function TEST(title, func) {
  test(title, async ({ browser }) => {

    // produce the amount of user instances needed
    const users = await Promise.all(
        Array.from({ length: func.length }).map(async () => {
            const context = await browser.newContext();
            const page = await context.newPage();
            return Helpers({ page });
        })
    );
    await func(...users);
  });
}
