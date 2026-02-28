import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly url = '/';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(this.url);
  }
}
