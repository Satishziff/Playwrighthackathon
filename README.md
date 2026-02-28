# Playwright Automation Project

This project uses [Playwright](https://playwright.dev/) with TypeScript for end-to-end testing.

## Folder Structure
- `tests/` - Test files
- `page-objects/` - Page Object Model classes
- `fixtures/` - Custom fixtures
- `config/` - Additional configuration files

## Scripts
- `npm test` - Run all tests
- `npm run test:headed` - Run tests in headed mode
- `npm run test:debug` - Run tests in debug mode
- `npm run codegen` - Launch Playwright codegen

## Getting Started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Run tests:
   ```sh
   npm test
   ```

## Configuration
- Edit `playwright.config.ts` for global settings.
- Add more page objects and tests as needed.
