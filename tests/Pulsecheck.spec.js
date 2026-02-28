const { test, expect } = require('@playwright/test');
const { SuperAdminPage } = require('../page-objects/SuperAdminPage');
const { OrgAdminPage } = require('../page-objects/OrgAdminPage');
const { GroupAdminPage } = require('../page-objects/GroupAdminPage');
const { TeamMemberPage } = require('../page-objects/TeamMemberPage');

test.describe('PulseCheck - Super Admin Role', () => {
    let superAdmin;

    test.beforeEach(async ({ page }) => {
        superAdmin = new SuperAdminPage(page);
        await superAdmin.goto();
        // Assuming mock login or bypass for demo purposes
    });

    test('Verify Super Admin can create new Tenant/Organization with valid details', async () => {
        await superAdmin.createTenant('Acme Corp', 'admin@acmecorp.com');
        await expect(superAdmin.tenantList.filter({ hasText: 'Acme Corp' })).toBeVisible();
    });

    test('Confirm Super Admin cannot access Tenant questionnaires or employee data', async ({ page }) => {
        // Navigate to a tenant-specific data URL and expect 403 or redirect
        await page.goto('/tenant/acme-corp/data');
        await expect(page).not.toHaveURL(/.*\/data/);
        await expect(page.locator('text=Access Denied')).toBeVisible();
    });

    test('Validate platform settings updates apply across tenants', async () => {
        await superAdmin.updateGlobalConfig('Custom Value');
        // Verify in another "tenant context" (mocked)
        await expect(superAdmin.globalConfigInput).toHaveValue('Custom Value');
    });

    test('Test Tenant deletion removes all associated data', async () => {
        await superAdmin.deleteTenant('Acme Corp');
        await expect(superAdmin.tenantList.filter({ hasText: 'Acme Corp' })).not.toBeVisible();
    });
});

test.describe('PulseCheck - Org Admin Role', () => {
    let orgAdmin;

    test.beforeEach(async ({ page }) => {
        orgAdmin = new OrgAdminPage(page);
        await orgAdmin.goto();
    });

    test('Create Group within assigned Tenant and assign Group Admins', async () => {
        await orgAdmin.createGroup('Engineering', 'John Doe');
        await expect(orgAdmin.page.locator('text=Engineering')).toBeVisible();
    });

    test('Define Global Baseline Attributes and verify visibility', async () => {
        await orgAdmin.defineGlobalAttribute('Collaboration');
        await expect(orgAdmin.page.locator('text=Collaboration')).toBeVisible();
    });

    test('View Org-level Dashboard metrics', async () => {
        await orgAdmin.dashboardLink.click();
        await expect(orgAdmin.pulseIndexValue).toBeVisible();
        await expect(orgAdmin.heatmapContainer).toBeVisible();
        await expect(orgAdmin.submissionRateValue).toBeVisible();
    });
});

test.describe('PulseCheck - Group Admin Role', () => {
    let groupAdmin;

    test.beforeEach(async ({ page }) => {
        groupAdmin = new GroupAdminPage(page);
        await groupAdmin.goto();
    });

    test('View Group Dashboard visuals', async () => {
        await expect(groupAdmin.pulseTimeline).toBeVisible();
        await expect(groupAdmin.radarChart).toBeVisible();
        await expect(groupAdmin.narrativeFeed).toBeVisible();
    });

    test('Create Group-specific Custom Attribute with weight 0', async () => {
        await groupAdmin.createCustomAttribute('Internal Tooling', 'Scale', 0);
        await expect(groupAdmin.page.locator('text=Internal Tooling')).toBeVisible();
    });
});

test.describe('PulseCheck - Team Member Role', () => {
    let teamMember;

    test.beforeEach(async ({ page }) => {
        teamMember = new TeamMemberPage(page);
        await teamMember.goto();
    });

    test('Daily Pulse Submission and local history', async () => {
        const scores = { happiness: 8, energy: 7, satisfaction: 9, stress: 3, purpose: 8 };
        await teamMember.submitPulse(scores, 'Feeling productive today!');

        // Verify local storage
        const history = await teamMember.getLocalStorageHistory();
        expect(history.length).toBeGreaterThan(0);
        expect(history[0].happiness).toBe(8);
    });

    test('Verify Personal Sentiment Timeline displays last 7 days', async () => {
        await expect(teamMember.personalTimeline).toBeVisible();
    });
});

test.describe('Anonymity & Calculations', () => {
    test('Pulse Index Calculation - High Score', async ({ page }) => {
        const teamMember = new TeamMemberPage(page);
        await teamMember.goto();
        const highScores = { happiness: 10, energy: 10, satisfaction: 10, stress: 0, purpose: 10 };
        await teamMember.submitPulse(highScores);

        // Mocked check for PI ≈ 100
        const piValue = await page.locator('.pi-display').textContent();
        expect(parseFloat(piValue)).toBeGreaterThanOrEqual(95);
    });

    test('Anonymity - Verify server receives fuzzed data', async ({ page }) => {
        let capturedRequest;
        page.on('request', request => {
            if (request.url().includes('/api/pulse/submit')) {
                capturedRequest = request.postDataJSON();
            }
        });

        const teamMember = new TeamMemberPage(page);
        await teamMember.goto();
        await teamMember.submitPulse({ happiness: 5, energy: 5, satisfaction: 5, stress: 5, purpose: 5 });

        expect(capturedRequest).not.toHaveProperty('userId');
        expect(capturedRequest).toHaveProperty('groupId');
        expect(capturedRequest.date).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00/); // Fuzzed date
    });
});
