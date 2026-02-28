import { Page } from '@playwright/test';

export class SuperAdminPage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.url = '/super-admin';
        this.createTenantButton = page.locator('button:has-text("Create Tenant")');
        this.tenantNameInput = page.locator('input[name="tenantName"]');
        this.tenantEmailInput = page.locator('input[name="tenantEmail"]');
        this.submitTenantButton = page.locator('button:has-text("Submit")');
        this.platformSettingsLink = page.locator('a:has-text("Platform Settings")');
        this.globalConfigInput = page.locator('input[name="globalConfig"]');
        this.saveSettingsButton = page.locator('button:has-text("Save Settings")');
        this.tenantList = page.locator('.tenant-list-item');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async createTenant(name, email) {
        await this.createTenantButton.click();
        await this.tenantNameInput.fill(name);
        await this.tenantEmailInput.fill(email);
        await this.submitTenantButton.click();
    }

    async updateGlobalConfig(value) {
        await this.platformSettingsLink.click();
        await this.globalConfigInput.fill(value);
        await this.saveSettingsButton.click();
    }

    async deleteTenant(name) {
        const tenantRow = this.tenantList.filter({ hasText: name });
        await tenantRow.locator('button:has-text("Delete")').click();
        await this.page.locator('button:has-text("Confirm Delete")').click();
    }
}
