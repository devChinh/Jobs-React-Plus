class CommonFunctions {

    static randomText (length){
        var result           = ''
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
       }
       return result
    }

    static getLastSegmentOfUrl(url) {
        const segments = new URL(url).pathname.split('/')
        const last = segments.pop() || segments.pop()
        return last
    }

}

module.exports = { CommonFunctions }