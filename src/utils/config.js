export function getAppConfig() {
    let config = {
        loginUrl: '//account.qmai.cn?callback=https://site.qmai.cn',
        baseUrl: '//site.qmai.cn/api'
    }
    try {
        const hostName = window.location.hostname
        if (hostName !== 'localhost') {
            const n = hostName.indexOf('.')
            if (n) {
                const host = hostName.substring(n + 1, hostName.length)
                if (host.length > 0) {
                    config.loginUrl = '//account.' + host + '?callback=https://site.' + host
                    config.baseUrl = '//inapi.' + host + '/web'
                }
            }
        } else {
            config.loginUrl = '//account.zvcms.com'
            config.baseUrl = '//inapi.zvcms.com/web'
        }
        return config
    } catch (e) {
        return config
    }
}
