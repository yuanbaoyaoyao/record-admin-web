import axios from "axios";
import {
    ElMessage
}  from "element-plus";

const service = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 3 * 1000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    }
})

service.interceptors.request.use(
    config => {

        return config;
    },
    error => {

        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    response => {

        return response.data;
    },
    error => {
        if (error.response && error.response.status) {
            const status = error.response.status
            switch (status) {
                case 400:
                    message = '请求错误';
                    break;
                case 401:
                    message = '没授权，请重新登录';
                    break;
                case 403:
                    message = '拒绝访问';
                    break;
                case 404:
                    message = '请求地址出错';
                    break;
                case 405:
                    message = '请求方法未允许'
                    break;
                case 408:
                    message = '请求超时';
                    break;
                case 500:
                    message = '服务器内部错误';
                    break;
                case 501:
                    message = '服务未实现';
                    break;
                case 502:
                    message = '网络错误';
                    break;
                case 503:
                    message = '服务不可用';
                    break;
                case 504:
                    message = '网络超时';
                    break;
                case 505:
                    message = 'HTTP版本不受支持';
                    break;
                default:
                    message = '请求失败'
            }
        } else {
            if (JSON.stringify(error).includes('timeout')) {
                ElMessage.error('服务器响应超时，请刷新当前页')
            }
        }
        ElMessage.error(message)
        return Promise.reject(error);
    }
)

export default service