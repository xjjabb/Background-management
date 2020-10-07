import {request} from './index.js'

//登录
export function loginRequest(params){
    return request({
        url: 'login',
        method: 'post',
        params
    });
}