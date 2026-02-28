const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
    features: 'features/*.feature',
    steps: 'steps/*.js',
});

module.exports = defineConfig({
    testDir,
    timeout: 30000,
    retries: 0,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on',
        screenshot: 'on',
        baseURL: 'https://example.com',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
