import axios from 'axios'
// import store from '@/store/index'
import { message, Modal } from 'antd'
import { getAppConfig } from './config'

const { confirm } = Modal

const appConfig = getAppConfig()
const server = axios.create({
    baseURL: appConfig.baseUrl,
    timeout: 10000,
    responseType: 'json',
    withCredentials: true // 允许携带cookie
})

// 请求拦截器
server.interceptors.request.use(config => {
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
server.interceptors.response.use(response => {
    const res = response && response.data
    if (!res.status) {
        // 异常处理
        if (res.code == '9001') {
            confirm({
                title: '你已被登出，请重新登录?',
                onOk() {
                    window.location.href = appConfig.loginUrl
                },
                onCancel() {
                    console.log('Cancel')
                }
            })
            return res
        
        } else {
            message.error(res.message || '请求超时，稍后重试')
            return res
        }
    } else {
        return res
    }
}, error => {
    message.error(error.message)
    return error.data
})

export default server