import { Page } from '@playwright/test';

export class OrgAdminPage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.url = '/org-admin';
        this.createGroupButton = page.locator('button:has-text("Create Group")');
        this.groupNameInput = page.locator('input[name="groupName"]');
        this.assignAdminDropdown = page.locator('select[name="groupAdmin"]');
        this.submitGroupButton = page.locator('button:has-text("Create")');
        this.globalAttributesLink = page.locator('a:has-text("Global Attributes")');
        this.addAttributeButton = page.locator('button:has-text("Add Attribute")');
        this.attributeNameInput = page.locator('input[name="attrName"]');
        this.saveAttributesButton = page.locator('button:has-text("Save Attributes")');
        this.dashboardLink = page.locator('a:has-text("Org Dashboard")');
        this.pulseIndexValue = page.locator('.pulse-index-large');
        this.heatmapContainer = page.locator('.heatmap-container');
        this.submissionRateValue = page.locator('.submission-rate-percent');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async createGroup(name, adminName) {
        await this.createGroupButton.click();
        await this.groupNameInput.fill(name);
        await this.assignAdminDropdown.selectOption({ label: adminName });
        await this.submitGroupButton.click();
    }

    async defineGlobalAttribute(name) {
        await this.globalAttributesLink.click();
        await this.addAttributeButton.click();
        await this.attributeNameInput.fill(name);
        await this.saveAttributesButton.click();
    }
}
