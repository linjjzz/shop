import {
    request
} from "./request"

export function getOrders(queryInfo) {
    return request({
        url: '/orders',
        params: queryInfo
    })
}


