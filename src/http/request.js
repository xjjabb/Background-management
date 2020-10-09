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

//分配角色
export function assignRolesRequest(id,rid){
    return request({
        url: `users/${id}/role`,
        method: 'put',
        data: {
            rid
        }
    })
}

//获取角色列表
export function getRolesRequest(){
    return request({
        url: 'roles',
        method: 'get'
    })
}

//查询所有权限列表
export function selectRightsRequest(type){
    return request({
        url: `rights/${type}`,
        method: 'get'
    })
}

//角色授权
export function roleAuthorizationRequest(id,rids){
    return request({
        url: `roles/${id}/rights`,
        method: 'post',
        data: {
            rids
        }
    })
}

//删除角色指定权限
export function deleteRightsRequest(roleId,rightId){
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

//添加角色
export function insertRolesRequest(data){
    return request({
        url: 'roles',
        method: 'post',
        data
    })
}

//根据角色id查询角色
export function selectRoleById(id){
    return request({
        url: `roles/${id}`,
        method: 'get'
    })
}

//编辑角色
export function updateUserRoles(id,data){
    return request({
        url: `roles/${id}`,
        method: 'put',
        data
    })
}

//删除角色
export function deleteUserRightsRequest(id){
    return request({
        url: `roles/${id}`,
        method: 'delete'
    })
}
