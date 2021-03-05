import {request} from "./request"

export function getSwitchState(userInfo) {
  return request({
    method: 'put',
    url: `/users/${userInfo.id}/state/${userInfo.mg_state}`,
    params: {
      userInfo,
    },
  })
}