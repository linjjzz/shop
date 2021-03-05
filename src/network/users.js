import {
    request
} from "./request"

export function getUserList(queryInfo) {
    return request({
        url: '/users',
        params: queryInfo
    })
}

export function addUsers(addForm) {
    return request({
        method: 'post',
        url: '/users',
        params: addForm,
        data: addForm
    })
}

export function editUsers(id) {
    return request({
        url: '/users/' + id,
        params: id
    })
}

export function commitUsers(editForm) {
    return request({
        method: 'put',
        url: `/users/${editForm.id}`,
        params: editForm,
        data: editForm
    })
}

export function deleteUsers(id) {
    return request({
        method: 'delete',
        url: '/users/' + id,
        params: id
    })
}

export function getRoles() {
    return request({
        url: '/roles',
    })
}

export function updateRole(uid, rid) {
    return request({
        method: 'put',
        url: `/users/${uid}/role`,
        params: {
            uid
        },
        data: {
            rid: rid
        }
    })
}