"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const config = {
    testDir: './tests',
    timeout: 30000,
    retries: 0,
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: 'on',
        screenshot: 'on',
        baseURL: 'https://example.com',
        browserName: 'chromium',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...test_1.devices['Desktop Chrome'], headless: false },
        },
    ],
    reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
};
exports.default = config;
