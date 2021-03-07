import {
    request
} from "./request"

export function getCate(queryInfo) {
    return request({
        url: '/categories',
        params: queryInfo
    })
}

export function getParentCate() {
    return request({
        url: '/categories',
        params: {
            type: 2
        }
    })
}

export function addCateInfo(addCateForm) {
    return request({
        method: 'post',
        url: '/categories',
        data: addCateForm
    })
}

export function selectCate(cateInfo) {
    return request({
        url: '/categories/' + cateInfo.cat_id,
        params: cateInfo
    })
}

export function commitCate(editCateForm) {
    return request({
        method: 'put',
        url: '/categories/' + editCateForm.cat_id,
        params: editCateForm,
        data: editCateForm
    })
}

export function deleteCate(cateInfo) {
    return request({
        method: 'delete',
        url: '/categories/' + cateInfo.cat_id,
        params: cateInfo
    })
}