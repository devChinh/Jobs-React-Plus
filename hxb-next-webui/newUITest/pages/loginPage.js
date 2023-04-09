const { BasePage } = require("./basePage")
const { LoginPageLocator } = require("../locators/loginPageLocator")
const locator = LoginPageLocator

class LoginPage extends BasePage {
    constructor(page){
        super(page)
        this.page = page
    }

    async goToURL(){
        await this.goTo(process.env.BASE_URL)
    }

    // Login 
    async fillInEmailAndPassword(email, pw){
        await this.fillInput(locator.emailField, email)
        await this.fillInput(locator.pwField, pw)
    }

    async fillInEmail(email){
        await this.fillInput(locator.emailField, email)
    }

    async fillInEmailAndPasswordWithValid(){
        await this.fillInEmailAndPassword(process.env.EMAIL, process.env.PASSWORD)
    }

    async clickLoginButton(){
        await this.clickElement(locator.loginButton)
    }
         

    async login(){
        await this.fillInEmailAndPasswordWithValid()
        await this.clickLoginButton()
    }

    // Get error mess
    async getEmailError(){
        return await this.getTextElement(locator.emailErrorText)
    }

    async getPwError(){
        return await this.getTextElement(locator.pwErrorText)
    }

    async getTextNotification(){
        return await this.getTextElement(locator.errorAlert)
    }

    // Displayed
    async checkEmailFieldDisplayed(){
        return await this.checkDisplayElement10s(locator.emailField)
    }


}


module.exports = { LoginPage }