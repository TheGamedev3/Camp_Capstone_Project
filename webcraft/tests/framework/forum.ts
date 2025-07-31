
export async function Forum(forumName, fields){
    const scope = `[data-forum="${forumName}"]`;

    for (const [field, value] of Object.entries(fields)) {
        await this.page.fill(`${scope} input[name="${field}"]`, value);
    }
}

export async function Submit(forumName){
    const scope = `[data-forum="${forumName}"]`;
    await this.page.click(`${scope} button[name="${forumName}-submit"]`);
    await this.page.waitForLoadState('networkidle');
}
