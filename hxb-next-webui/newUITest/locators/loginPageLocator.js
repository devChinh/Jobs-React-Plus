class LoginPageLocator {

    static emailField = '//input[@id="email"]'
    static pwField = '//input[@id="password"]'
    static loginButton = '//button[@type="submit"]'

    static emailErrorText = '//p[@id="email-helper-text"]'
    static pwErrorText = '//p[@id="password-helper-text"]'
    static errorAlert = '//div[contains(@class,"MuiAlert-message")]'
}

module.exports = { LoginPageLocator }