const { LoginPage } = require("../pages/loginPage")
const { HomePage } = require("../pages/homePage")
const base = require('@playwright/test')

// Extend base test by providing "todoPage" and "settingsPage".
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
exports.test = base.test.extend({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page))
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
      },

  });

exports.expect = base.expect;