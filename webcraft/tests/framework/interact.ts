

export async function Click(label: string){
    await this.page.click(`button:has-text("${label}")`);
    await this.page.waitForLoadState('networkidle');
}
