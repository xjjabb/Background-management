import axios from 'axios'

export function request(config){
    const insatance=axios.create({
        baseURL: 'http://127.0.0.1:8888/api/private/v1/',
        timeout: 10000,
    });

    insatance.interceptors.request.use(config => {
        //为请求添加验证的Authorization字段
        config.headers.Authorization=window.sessionStorage.getItem('token');
        return config;
    },error => {
    
        return Promise.reject(error);
    });

    return insatance(config);
}