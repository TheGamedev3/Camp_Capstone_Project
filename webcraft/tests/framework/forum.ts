
export async function Forum(forumName, fields) {
  const scope = `[data-forum="${forumName}"]`;

  // ✅ Wait for forum container to exist
  await this.waitUntil(
    async () => (await this.page.locator(scope).count()) > 0,
    () => `No data-forum '${forumName}' was found`
  );

  for (const [field, value] of Object.entries(fields)) {
    const input = this.page.locator(`${scope} input[name="${field}"]`);

    // ✅ Fill the field
    await input.fill(value);

    // ✅ Confirm the value was applied correctly (retry if not)
    await this.waitUntil(
      async () => (await input.inputValue()) === value,
      () => `Failed to confirm fill for '${field}' in '${forumName}' (expected '${value}')`
    );
  }

  // ⏱️ Give time for useEffect to finish potential clobbering
  // this rigorous verification is to prevent race conditions such as submitting the info before the useEffect hook in the forum component finishes processing the data
  await this.page.waitForTimeout(30); // 20–50ms is safe
}


export async function Submit(forumName){
    const scope = `[data-forum="${forumName}"]`;
    const selector = `${scope} button[name="${forumName}-submit"]`;

    await this.waitUntil(
        async () => {
            return (await this.page.locator(selector).count()) > 0;
        },
        ()=>`no submit btn data-forum '${forumName}' was found`
    );
    
    await this.page.click(selector);
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