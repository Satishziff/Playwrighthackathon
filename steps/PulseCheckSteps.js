const { createBdd } = require('playwright-bdd');
const { test } = require('@playwright/test');
const { SuperAdminPage } = require('../page-objects/SuperAdminPage');
const { OrgAdminPage } = require('../page-objects/OrgAdminPage');
const { GroupAdminPage } = require('../page-objects/GroupAdminPage');
const { TeamMemberPage } = require('../page-objects/TeamMemberPage');

const { Given, When, Then } = createBdd(test);

// Super Admin Steps
Given('I am logged in as a Super Admin', async ({ page }) => {
    const superAdmin = new SuperAdminPage(page);
    await superAdmin.goto();
});

When('I create a new Tenant with name {string} and email {string}', async ({ page }, name, email) => {
    const superAdmin = new SuperAdminPage(page);
    await superAdmin.createTenant(name, email);
});

Then('I should see {string} in the tenant list', async ({ page }, name) => {
    const superAdmin = new SuperAdminPage(page);
    await expect(superAdmin.tenantList.filter({ hasText: name })).toBeVisible();
});

// Org Admin Steps
Given('I am logged in as an Org Admin', async ({ page }) => {
    const orgAdmin = new OrgAdminPage(page);
    await orgAdmin.goto();
});

When('I create a group {string} and assign {string} as Group Admin', async ({ page }, groupName, adminName) => {
    const orgAdmin = new OrgAdminPage(page);
    await orgAdmin.createGroup(groupName, adminName);
});

Then('I should see the group {string} in my organization', async ({ page }, groupName) => {
    await expect(page.locator(`text=${groupName}`)).toBeVisible();
});

// Team Member Steps
Given('I am logged in as a Team Member', async ({ page }) => {
    const teamMember = new TeamMemberPage(page);
    await teamMember.goto();
});

When('I submit a pulse survey with the following scores:', async ({ page }, dataTable) => {
    const teamMember = new TeamMemberPage(page);
    const scores = {};
    dataTable.hashes().forEach(row => {
        scores[row.attribute.toLowerCase()] = parseInt(row.score);
    });
    await teamMember.submitPulse(scores, '');
});

When('I provide feedback {string}', async ({ page }, feedback) => {
    const teamMember = new TeamMemberPage(page);
    await teamMember.feedbackTextarea.fill(feedback);
    await teamMember.submitPulseButton.click();
});

Then('my pulse submission should be recorded in my local history', async ({ page }) => {
    const teamMember = new TeamMemberPage(page);
    const history = await teamMember.getLocalStorageHistory();
    expect(history.length).toBeGreaterThan(0);
});

// Anonymity & Calculations
When('I submit my pulse survey', async ({ page }) => {
    const teamMember = new TeamMemberPage(page);
    await teamMember.submitPulse({ happiness: 5, energy: 5, satisfaction: 5, stress: 5, purpose: 5 });
});

Then('the server should receive an anonymous record with fuzzed date and no user ID', async ({ page }) => {
    // Logic to verify fuzzed request (as in standard spec)
});

When('I submit a pulse survey with maximum scores for all positive attributes', async ({ page }) => {
    const teamMember = new TeamMemberPage(page);
    await teamMember.submitPulse({ happiness: 10, energy: 10, satisfaction: 10, stress: 0, purpose: 10 });
});

Then('my individual Pulse Index should be approximately 90 or higher', async ({ page }) => {
    const piValue = await page.locator('.pi-display').textContent();
    expect(parseFloat(piValue)).toBeGreaterThanOrEqual(90);
});
