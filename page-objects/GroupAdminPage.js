import { Page } from '@playwright/test';

export class GroupAdminPage {
    /**
     * @param {Page} page
     */
    constructor(page) {
        this.page = page;
        this.url = '/group-admin';
        this.dashboardLink = page.locator('a:has-text("Group Dashboard")');
        this.pulseTimeline = page.locator('.pulse-timeline');
        this.radarChart = page.locator('canvas.radar-chart');
        this.narrativeFeed = page.locator('.narrative-feed');
        this.customAttributesLink = page.locator('a:has-text("Custom Attributes")');
        this.createAttributeButton = page.locator('button:has-text("Create Attribute")');
        this.attrNameInput = page.locator('input[name="name"]');
        this.attrTypeDropdown = page.locator('select[name="type"]');
        this.attrWeightInput = page.locator('input[name="weight"]');
        this.saveAttributeButton = page.locator('button:has-text("Save")');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async createCustomAttribute(name, type, weight) {
        await this.customAttributesLink.click();
        await this.createAttributeButton.click();
        await this.attrNameInput.fill(name);
        await this.attrTypeDropdown.selectOption(type);
        await this.attrWeightInput.fill(weight.toString());
        await this.saveAttributeButton.click();
    }
}
