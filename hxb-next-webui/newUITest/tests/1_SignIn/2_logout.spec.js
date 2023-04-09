const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage')
const { HomePage } = require('../../pages/homePage')
const { Constant } = require('../../fixtures/constant');

test.describe('Test Logout functions Fuction', async () => {
    let loginpage = new LoginPage()
    let homepage = new HomePage()
    test.beforeEach(async ({page} ) => {
        loginpage = new LoginPage(page)
        homepage = new HomePage(page)

        await loginpage.goToURL()
        await loginpage.login()
      });

    test("Test Logout successfully " ,async () => {
        await homepage.clickLogoutIcon()
        const displayed = await loginpage.checkEmailFieldDisplayed()
        await expect(displayed).toBe(true)
        console.log("Log out successfully")
    })

});