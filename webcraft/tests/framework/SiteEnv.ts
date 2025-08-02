
// helpers.ts -----------------------------------------------------------
import { test, Page } from '@playwright/test';
export { expect } from '@playwright/test';

export const DEFAULT_TIMEOUT = 6_000;
export const INTERVAL        = 300;

/* -------------------------------------------------------------------- */
/* 1️⃣  Import helper modules                                            */
/* -------------------------------------------------------------------- */
import * as expectors   from './expectors';
import * as forum       from './forum';
import * as interact    from './interact';
import * as setters     from './setters';
import * as setups      from './setups';
import * as navigation  from './navigation';

/* -------------------------------------------------------------------- */
/* 2️⃣  Aggregate helper types                                           */
/* -------------------------------------------------------------------- */
type Expectors   = typeof expectors;
type Forum       = typeof forum;
type Interact    = typeof interact;
type Setters     = typeof setters;
type Setups      = typeof setups;
type Navigation  = typeof navigation;

export type TestHelpers = {
  page: Page;
} & Expectors & Forum & Interact & Setters & Setups & Navigation;

/* Strip the bound-this type from functions so IntelliSense shows them
   as normal callables (same params / return types).                  */
type StripThis<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => R
    : T[K];
};

export type BoundHelpers = StripThis<TestHelpers>;

/* -------------------------------------------------------------------- */
/* 3️⃣  Factory that binds `this` and returns fully-typed helpers        */
/* -------------------------------------------------------------------- */
function Helpers({ page }: { page: Page }): BoundHelpers {
  const toolbox: TestHelpers = {
    page,
    ...expectors,
    ...forum,
    ...interact,
    ...setters,
    ...setups,
    ...navigation,
  };

  const bound = Object.fromEntries(
    Object.entries(toolbox).map(([k, v]) => [
      k,
      typeof v === 'function' ? v.bind(toolbox) : v,
    ]),
  ) as unknown as BoundHelpers;   // <- single cast, keeps IntelliSense 👍

  return bound;
}

/* -------------------------------------------------------------------- */
/* 4️⃣  Typed TEST wrapper                                               */
/* -------------------------------------------------------------------- */
import { expectationCatcher } from './Errs';
export function TEST<
  Fn extends (...args: BoundHelpers[]) => Promise<unknown> | void,
>(
  title: string,
  func: Fn,
) {
  test(title, async ({ browser }) => {
    /* Create one helper instance per function parameter */
    const helpers: BoundHelpers[] = await Promise.all(
      Array.from({ length: func.length }).map(async () => {
        const context = await browser.newContext();
        const page    = await context.newPage();
        return Helpers({ page });
      }),
    );

    // Fully-typed call ✔️
    await expectationCatcher(async()=>await func(...helpers));
  });
}
