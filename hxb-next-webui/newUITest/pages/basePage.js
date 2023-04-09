const { imgDiff } = require("img-diff-js")
const assert = require("assert")
const { exception } = require("console");

require('dotenv').config(
    {path: `env/.env.${process.env.ENV}`}
)

class BasePage {
    constructor(page) {
        this.page = page;
    }
    async back2Homepage() {
        await this.page.url();
    }

    async goTo(url){
        await this.page.goto(url,{ timeout: 30000})
    }
    // CHECK ELEMENTS
    async is_disable(selector) {
        await this.page.waitForSelector(selector, { timeout: 10000 })
        let result = await this.page.isDisabled(selector)
        return result
    }

    async is_enable(selector) {
        await this.page.waitForSelector(selector, { timeout: 20000 })
        let result = await this.page.isEnabled(selector)
        return result
    }

    async checkDisplayElement30s(selector) {
        try {    
            await this.page.waitForSelector(selector, { timeout: 30000 })
            const hrefElement = await this.page.isVisible(selector)
            return hrefElement
        } catch (error) {
            return false
        }
    }

    async waitElementDisappearElement(selector) {
        try {    
            await this.page.waitForSelector(selector, {state: 'detached', timeout: 15000});
            return true
        } catch (error) {
            return false

        }
    }

    async checkDisplayElementWith5s(selector) {
        try {    
            await this.page.waitForSelector(selector, { timeout: 5000 })
            const hrefElement = await this.page.isVisible(selector)
            return hrefElement
        } catch (error) {
            return false
        }
    }


    // CLICK ELEMENT
    async clickElement(selector) {
        await this.page.waitForSelector(selector, { timeout: 15000 })
        const hrefElement = await this.page.click(selector)
        return hrefElement
    }

    async doubleClickElement(selector, element) {
        await this.page.waitForSelector(selector, { timeout: 20000 })
        const hrefElement = await this.page.dblclick(selector)
        return hrefElement
    }

    async clickRandomElement(element) {
        await this.page.waitForSelector(element, { timeout: 10000 })
        let select_random_value = await this.page.$$(element)
        const random_field = Math.floor(Math.random() * select_random_value.length)
        await select_random_value[random_field].click()
    }

    async clickIndexElement(element, index) {
        await this.page.waitForSelector(element, { timeout: 10000 })
        let select_random_value = await this.page.$$(element)
        await select_random_value[index].click()
    }


    // Fill input
    async fillInput(selector, input) {
            await this.page.waitForSelector(selector, { timeout: 10000 })
            const hrefElement = await this.page.fill(selector, input)
            return hrefElement
    }

    // GET TEXT
    async getTextElement(element) {
        // displayed = await this.checkDisplayElementWith5s(element)
        try {
            let text = await this.page.textContent(element, {timeout: 10000})
            return text.trim()
        } catch (a) {
            console.log(`Cannot find element ${element}`)
            throw exception
        }
    }

    async getTextElements(element) {
        let list = []
        await this.page.waitForSelector(element, { timeout: 10000 })
        let els = await this.page.$$(element)
        for (let i=0; i< els.length; i++){
            let text = await els[i].innerText();
            let txt = text.trim()
            await list.push(txt)
        }
        return await list
    }

    async getTextIndexElements(element, index) {
        await this.page.waitForSelector(element, { timeout: 10000 })
        let els = await this.page.$$(element)
        let text = await els[index].innerText();
        return await text
    }

    async getValue(element) {
        await this.page.waitForSelector(element, { timeout: 20000 })
        //let text = await page.textContent(element)
        //let text = await page.text(element)
        let text = await this.page.$eval(element, el => el.value)
        return text
    }

    async getAttribute(locator, attribute){
        await this.page.waitForSelector(locator, { timeout: 10000 })
        const elementHandle = await this.page.$(locator)
        let value = await elementHandle.getAttribute(attribute)
        return value
    }

    async getValues(element){
        await this.page.waitForSelector(element, { timeout: 10000 })
        //let text = await page.textContent(element)
        //let text = await page.text(element)
        let els = await this.page.$eval(element, async el =>{
            let array = []
            for (let i=0; i< el.length; i++){
                await console.log(el[i].value)
                await array.push(el[i].value)
            }
        })
        return els
    }

    async getAttributeValues(element, attribute){
        let list = []
        // not waitForSelector because option show only click droplist
        // await page.waitForSelector(element, { timeout: 1000 })
        let els = await this.page.$$(element)
        for (let i=0; i< els.length; i++){
            let text = await els[i].getAttribute(attribute);
            await list.push(text)
        }
        return await list
    }

    async checkDisplayElement10s(selector) {
        try {    
            await this.page.waitForSelector(selector, { timeout: 10000 })
            const hrefElement = await this.page.isVisible(selector)
            return hrefElement

        } catch (error) {
            return false

        }
    }

    // Image
    async screenshotElement(locator, Path) {
        await this.page.waitForSelector(locator, { timeout: 10000 })
        const elementHandle = await this.page.$$(locator)
        await elementHandle[0].screenshot({ path: Path })
        return Path
    }

    async compareTwoImage(image1_path, image2_path) {
        const diff = await imgDiff({
            actualFilename: image1_path,
            expectedFilename: image2_path,
        })
        const bool = diff.imagesAreSame
        return bool
    }


    // sleep code
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }


    // Get element
    async getElements(element) {
        await this.page.waitForSelector(element, { timeout: 10000 })
        return await this.page.$$(element)
    }



    // Hover
    async hoverElement(selector){
        await this.page.waitForSelector(selector, { timeout: 10000 })
        await this.page.hover(selector, {force: true} )
    }

    async dropAndDrag(start_x, start_y, end_x, end_y){
        await this.page.mouse.move(start_x,start_y)
        await this.page.mouse.down()
        //split action to 2 step 
        await this.page.mouse.move(end_x,end_y,{ steps: 2 })
        await this.sleep(500)
        await this.page.mouse.up()
    }

    async dropAndDragVer17(selector_source, selector_target){
        try {
            await this.page.waitForSelector(selector_source, { timeout: 5000 })
            await this.page.waitForSelector(selector_target, { timeout: 5000 })
            await this.page.dragAndDrop(selector_source,selector_target, { timeout: 5000 })
            return await true
        } catch (error) {
            return await false
        }
    }


    // Keyboard
    // https://playwright.dev/docs/api/class-keyboard
    async keyboard(key){
        await this.page.keyboard.press(key);
    }

    // Date
    async currentDate(){
        var today = new Date();
        var date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
        var time = today.getHours() + "_" + today.getMinutes() + "_" + today.getSeconds();

        return date+time
    }

    // Get Download - Upload
    async getDownload(selector){
        try {
            const [ download ] = await Promise.all([
                this.page.waitForEvent('download'), // wait for download to start
                this.page.click(selector)
            ]);
            const path = await download.path();
            return path
        } catch (error) {
            return null
        }
    }

    async uploadFile(selector, file_path){
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.click(selector)
        ]);
        await fileChooser.setFiles(file_path)
    }

    // Drop Down
    async chooseOptionInDropListElement(element, option){
        await this.page.waitForSelector(element, { timeout: 1000 })
        await this.page.click(element)
        await this.page.selectOption(element, option)
    }

    // Page
    async reloadPage(){
        await this.page.reload()
    }

    async getPropertyValue(selector, property){
        const element = await this.page.waitForSelector(selector);
        const propertyValue = await element.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue(property);
            }); 
        return propertyValue
    }

    async waitForNavigation() {
        await this.page.waitForNavigation()
    }

    async getCurrentUrl() {
        return await this.page.url()
    }

}
module.exports = { BasePage }