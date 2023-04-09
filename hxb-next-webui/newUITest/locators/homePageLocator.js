class HomePageLocator {

    // Left Menu
    static leftMenuList = "//span[contains(@class,'MuiListItemText-primary')]"
    static menuTab(tab) {
        return `//span[contains(@class,'MuiListItemText-primary') and text()='${tab}']`
    }

    // Header
    static logoutIcon = "//button[contains(@class,'MuiButtonBase-root MuiIconButton-root')]"
    static languageSelect = "//div[@id='language-select']"
    static engOption = "//li[@data-value='en']"
    static japOption = "//li[@data-value='ja']"
}

module.exports = { HomePageLocator }