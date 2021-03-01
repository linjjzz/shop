import {request} from "./request"

export function getLogindate(loginFrom) {
  return request({
    method:'post',
    url: '/login',
    params: loginFrom
  })
}
