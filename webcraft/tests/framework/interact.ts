

export async function Click(label: string){
    await this.page.click(`button:has-text("${label}")`);
    await this.page.waitForLoadState('networkidle');
}

export async function ClickNav(label: string){
    const selector = [
        `a[name="${label}"]`,            // PlayerIcon links, they also end with -icon
        `a:has(span:has-text("${label}"))`, // for the header navigation link
    ].join(', ');

    const link = this.page.locator(selector).first();      // de-dupe if >1 match
    await link.waitFor({ state: 'visible' });
    await link.click({ trial: true });                // sanity-check
    await link.click();                               // real click
    await this.page.waitForLoadState('networkidle');
}
