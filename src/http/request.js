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
        url: 'menus',
        method: 'get'
    })
}

//请求用户列表数据
export function getUserListRequest(params){
    return request({
        url: 'users',
        method: 'get',
        params
    })
}

//修改用户状态
export function updateUserStatusRequest(params){
    return request({
        url: `users/${params.id}/state/${params.mg_state}`,
        method: 'put'
    })
}

//添加用户
export function insertUserRequest(data){
    return request({
        url: 'users',
        method: 'post',
        data
    })
}

//根据id查询用户
export function slesctUserByIdRequest(id){
    return request({
        url: `users/${id}`,
        method: 'get'
    })
}

//修改用户
export function updateUserRequest(id,data){
    return request({
        url: `users/${id}`,
        method: 'put',
        data
    })
}

//删除用户
export function deleteUserById(id){
    return request({
        url: `users/${id}`,
        method: 'delete'
    })
}