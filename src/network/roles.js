import {
    request
} from "./request"

export function getRoles() {
    return request({
        url: '/roles',
    })
}

export function addRole(addForm) {
    return request({
        method: 'post',
        url: '/roles',
        params: addForm,
        data: addForm
    })
}

export function editRole(id) {
    return request({
        url: '/roles/' + id,
        params: id
    })
}

export function commitUsers(editForm) {
    return request({
        method: 'put',
        url: '/roles/' + editForm.roleId,
        params: editForm,
        data: editForm
    })
}

export function deleteRoles(id) {
    return request({
        method: 'delete',
        url: '/roles/' + id,
        params: id
    })
}

export function deleteRight(roleId, rightId) {
    return request({
        method: 'delete',
        url: `/roles/${roleId}/rights/${rightId}`,
        params: {
            roleId,
            rightId
        }
    })
}

export function getRights() {
    return request({
        url: '/rights/tree',
    })
}

export function addRights(rids, roleId) {
    return request({
        method: 'post',
        url: `/roles/${roleId}/rights`,
        params: {
            rids,
            roleId
        },
        data: {
            rids,
            roleId
        }
    })
}