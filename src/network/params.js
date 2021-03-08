import {
    request
} from "./request"

export function getCate() {
    return request({
        url: '/categories',
    })
}

export function getAttributes(cateId, activeName) {
    return request({
        url: `/categories/${cateId}/attributes`,
        params: {
            sel: activeName
        }
    })
}

export function addAttributes(cateId, arrtName, activeName) {
    return request({
        method: 'post',
        url: `/categories/${cateId}/attributes`,
        data: {
            attr_name: arrtName,
            attr_sel: activeName
        }
    })
}

export function getAttrName(cateId, attrId, activeName) {
    return request({
        url: `/categories/${cateId}/attributes/${attrId}`,
        params: {
            attr_sel: activeName
        }
    })
}

export function editAttributes(cateId, attrId, attrName, activeName) {
    return request({
        method: 'put',
        url: `/categories/${cateId}/attributes/${attrId}`,
        data: {
            attr_name: attrName,
            attr_sel: activeName
        }
    })
}

export function deleteAttributes(cateId, attrId) {
    return request({
        method: 'delete',
        url: `/categories/${cateId}/attributes/${attrId}`,
    })
}

export function addAttrTag(cateId, attrId, attrName, attrSel, attrVals) {
    return request({
        method: 'put',
        url: `/categories/${cateId}/attributes/${attrId}`,
        data: {
            attr_name: attrName,
            attr_sel: attrSel,
            attr_vals: attrVals
        }
    })
}