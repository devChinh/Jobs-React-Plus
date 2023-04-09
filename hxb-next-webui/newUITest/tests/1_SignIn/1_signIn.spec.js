const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage')
const { HomePage } = require('../../pages/homePage')
const { Constant } = require('../../fixtures/constant');
const { CommonFunctions } = require('../../library/commonFunctions')

test.describe('Login Tests', async () => {
    let loginpage = new LoginPage()
    let homepage = new HomePage()
    test.beforeEach(async ({page} ) => {
        loginpage = new LoginPage(page)
        homepage = new HomePage(page)

        await loginpage.goToURL()
      });

    test("Should redirect to Dashboard after successful login" ,async () => {
        await loginpage.fillInEmailAndPasswordWithValid()
        await Promise.all([
            loginpage.waitForNavigation(),
            loginpage.clickLoginButton()
        ])
        let currentUrl = await homepage.getCurrentUrl()
        expect(currentUrl).toContain('/dashboard')
    })

    test("Login unsuccessfully with blank fields" ,async () => {
        await loginpage.clickLoginButton()
        const emailError = await loginpage.getEmailError()
        const pwError = await loginpage.getPwError()
        expect(emailError).toEqual(Constant.emaiRequiredlError)
        expect(pwError).toEqual(Constant.pwRequiredlError)
    })

    test("Login unsuccessfully with Email without '.'" ,async () => {
        await loginpage.fillInEmailAndPassword("lqa-tester@b-eeecom","Lqa@12345")
        await loginpage.clickLoginButton()
        const emailError = await loginpage.getEmailError()
        expect(emailError).toEqual(Constant.invalidEmailError)
    })

    test("Login unsuccessfully with Email without '@'" ,async () => {
        await loginpage.fillInEmailAndPassword("lqa-testerb-eee.com","Lqa@12345")
        await loginpage.clickLoginButton()
        const emailError = await loginpage.getEmailError()
        expect(emailError).toEqual(Constant.invalidEmailError)
    })

    test("Login unsuccessfully with Email with more than one '@'" ,async () => {
        await loginpage.fillInEmailAndPassword("lqa-tester@b@eee.com","Lqa@12345")
        await loginpage.clickLoginButton()
        const emailError = await loginpage.getEmailError()
        expect(emailError).toEqual(Constant.invalidEmailError)
    })

    test("Login unsuccessfully with Email with space" ,async () => {
        await loginpage.fillInEmailAndPassword(" ","Lqa@12345")
        await loginpage.clickLoginButton()
        const emailError = await loginpage.getEmailError()
        expect(emailError).toEqual(Constant.invalidEmailError)
    })

    test("Login unsuccessfully with password less than 8 characters" ,async () => {
        let pw = CommonFunctions.randomText(7)
        await loginpage.fillInEmailAndPassword("lqa-tester@beee.com", pw)
        await loginpage.clickLoginButton()
        const pwError = await loginpage.getPwError()
        expect(pwError).toEqual(Constant.notEnoughLengtPwError)
    })
    
    test("Login unsuccessfully with account don't exist in DB " ,async () => {
        await loginpage.fillInEmailAndPassword("alqa-tester@b-eee.com","Lqa@12345")
        await loginpage.clickLoginButton()
        const alertError = await loginpage.getTextNotification()
        expect(alertError).toEqual(Constant.messAlert)
    })

    test("Login unsuccessfully with wrong email" ,async () => {
        await loginpage.fillInEmailAndPassword("lqa-tester@b-eee.com","Lqa@1234")
        await loginpage.clickLoginButton()
        const alertError = await loginpage.getTextNotification()
        expect(alertError).toEqual(Constant.messAlert)
    })
});