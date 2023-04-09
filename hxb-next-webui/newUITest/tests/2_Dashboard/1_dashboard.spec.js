const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage')
const { HomePage } = require('../../pages/homePage')
const { Constant } = require('../../fixtures/constant');
const {CommonFunctions} = require('../../library/commonFunctions');

test.describe('Test Dashboard Fuction', async () => {
    let loginpage = new LoginPage()
    let homepage = new HomePage()
    test.beforeEach(async ({page} ) => {
        loginpage = new LoginPage(page)
        homepage = new HomePage(page)

        await loginpage.goToURL()
        await loginpage.login()
        const displayed = await homepage.checkLogoutIconDisplayed()
        expect(displayed).toBe(true)
      });

    test("Change language to ENG" ,async () => {
        await homepage.sleep(1000)
        await homepage.clickLanguageSelect()
        await homepage.clickEngOption()

        await homepage.sleep(1000)
        const textList = await homepage.getLeftMenuTextList()
        expect(textList).toStrictEqual(Constant.EngLeftMenuList)

        await homepage.reloadPage()

        const textListAfterReload = await homepage.getLeftMenuTextList()
        expect(textListAfterReload).toStrictEqual(Constant.EngLeftMenuList)

        
        console.log("Change to ENG successfully")
    })

    test("Change language to JA" ,async () => {
        await homepage.sleep(1000)
        await homepage.clickLanguageSelect()
        await homepage.clickJapOption()
        await homepage.sleep(1000)
        const textList = await homepage.getLeftMenuTextList()
        expect(textList).toStrictEqual(Constant.JapLeftMenuList)

        await homepage.reloadPage()
        const textListAfterReload = await homepage.getLeftMenuTextList()
        expect(textListAfterReload).toStrictEqual(Constant.JapLeftMenuList)
    })

    test("Left menu should goto target page when clicked", async () => {
        await homepage.sleep(1000)
        let listMenuItem = await homepage.getLeftMenuTextList()
        for (const item of listMenuItem) {
            await homepage.selectTab(item)
            let currentUrl = await homepage.getCurrentUrl()
            expect(currentUrl).toContain('/' + item.toLowerCase())
        }
    })

});