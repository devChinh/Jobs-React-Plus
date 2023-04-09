const { BasePage } = require("./basePage")
const { HomePageLocator } = require("../locators/homePageLocator")
const locator = HomePageLocator

class HomePage extends BasePage {
    constructor(page){
        super(page)
    }
    // Page
    async getColerPage(){
        return await this.getPropertyValue("//body", "background-color")
    }
    // left Menu ================================================
    async getLeftMenuTextList(){
        return this.getTextElements(locator.leftMenuList)
    }
    // header ===================================================
    async clickLogoutIcon(){
        await this.clickElement(locator.logoutIcon)
    }

    async clickLanguageSelect(){
        await this.clickElement(locator.languageSelect)
    }

    async clickLanguageSelect(){
        await this.clickElement(locator.languageSelect)
    }

    async clickEngOption(){
        await this.clickElement(locator.engOption)
    }

    async clickJapOption(){
        await this.clickElement(locator.japOption)
    }

    async checkLogoutIconDisplayed(){
        let displayed = await this.checkDisplayElement10s(locator.logoutIcon)
        return displayed
    }

    async selectTab(tab) {
        await Promise.all([
            this.waitForNavigation(),
            this.clickElement(locator.menuTab(tab))
        ])
    }
}


module.exports = { HomePage }