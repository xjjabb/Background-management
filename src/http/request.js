import {request} from './index.js'

//登录
export function loginRequest(params){
    return request({
        url: 'login',
        method: 'post',
        params
    });
}

//请求左侧菜单
export function leftMenuRequest(){
    return request({
        url: 'menus'
    })
}