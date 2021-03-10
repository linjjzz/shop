import {
    request
} from "./request"

export function getGoods(queryInfo) {
    return request({
        url: '/goods',
        params: queryInfo
    })
}

export function deleteGoods(id) {
    return request({
        method: 'delete',
        url: '/goods/' + id,
    })
}

export function getGoodsByid(id) {
    return request({
        url: '/goods/' + id,
    })
}

export function commitGoods(editForm) {
    return request({
        method: 'put',
        url: `/goods/${editForm.goods_id}`,
        data: editForm
    })
}