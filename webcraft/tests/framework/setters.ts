


export async function SetCheckbox(label: string, checked: boolean){
    const input = this.page.locator(`input[type="checkbox"][name="${label}"]`);

    const isChecked = await input.isChecked();
    if (isChecked !== checked) {
        await input.click(); // click to trigger React's onChange
        await this.page.waitForLoadState('networkidle'); // let any re-renders settle
    }
}

export async function SetText(fields) {
  for (const [field, value] of Object.entries(fields)) {
    const input = this.page.locator(`input[name="${field}"]`);
    await input.fill(''); // always clear first

    if (value) {
      await input.type(value); // triggers onChange naturally
    } else {
      // Manually trigger input/change events for empty string
      await this.page.evaluate((name) => {
        const el = document.querySelector(`input[name="${name}"]`);
        if (!el) return;
        el.value = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, field);
    }
  }

  await this.page.waitForLoadState('networkidle');
}

export async function SetOption(selection: string, option: string){
    await this.page.selectOption(`select[name="${selection}"]`, option);
    await this.page.waitForLoadState('networkidle');
}
