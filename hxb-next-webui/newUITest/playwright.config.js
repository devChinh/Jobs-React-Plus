// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */

const config = {
    testDir: 'tests',
    // Each test is given 30 seconds
    timeout: 60000,
    reporter: [ ['html', { open: 'never', outputFolder: 'my-report' }] ],
    use: {
      headless: false,
      channel: 'chrome',
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      video: 'on-first-retry',
      screenshot: 'only-on-failure',
    }
  };
  
  module.exports = config;