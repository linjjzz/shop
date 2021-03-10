import {
    request
} from "./request"

export function getCate() {
    return request({
        url: '/categories',
    })
}

export function getManyAttr(cateId) {
    return request({
        url: `/categories/${cateId}/attributes`,
        params: {
            sel: 'many'
        }
    })
}

export function getOnlyAttr(cateId) {
    return request({
        url: `/categories/${cateId}/attributes`,
        params: {
            sel: 'only'
        }
    })
}

export function addCate(form) {
    return request({
        method: 'post',
        url: '/goods',
        data: form
    })
}