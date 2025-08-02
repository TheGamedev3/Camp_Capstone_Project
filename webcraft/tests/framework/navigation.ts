

export async function FinishLoading(promise: Promise<unknown>){
    await Promise.all([
        this.ExpectRouteToChange(),
        promise,
    ]);
}

export async function Back(){
    await this.FinishLoading(this.page.goBack());
}

export async function Forward(){
  await this.FinishLoading(this.page.goForward());
}

export async function GoTo(route:string){
    const originalPath = new URL(await this.page.url()).pathname;
    if(originalPath === route){return}
    await this.FinishLoading(this.page.goto(route));
}

export async function AttemptGoTo(route:string){
    await this.page.goto(route);
}

export async function ClickNav(label: string){
    const selector = [
        `a[name="${label}"]`,                   // PlayerIcon links, they also end with -icon
        `a:has(span:has-text("${label}"))`,     // for the header navigation link
        `a:has-text("${label}")`                // for the dropdown links with just the text
    ].join(', ');

    await this.waitUntil(
        async () => {
            return (await this.page.locator(selector).count()) > 0;
        },
        ()=>`no navlink elements with '${label}' were found\n(perhaps you're on the wrong page?)`
    );

    const link = this.page.locator(selector).first();      // de-dupe if >1 match
    await link.waitFor({ state: 'visible' });
    await link.click({ trial: true });                // sanity-check
    await this.FinishLoading(link.click());                               // real click
}

