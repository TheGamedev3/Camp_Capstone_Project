
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

type FillIn = {
  label: string;
  params: Record<string, any>;
  expectErrors: string | string[];
};

export async function FillForumWith(
  forumName: string,
  ...fillIns: FillIn[]
){
    for(const { label, params, expectErrors } of fillIns){
        console.log(`🧪 ${label}... - (${forumName} forum attempt test)`);
        await this.Forum(forumName, params);
        await this.Submit(forumName);
        await this.ExpectText(expectErrors);
    }
}