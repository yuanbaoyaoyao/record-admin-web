import http from "../utils/http";

let resquest = "/shiroIp/auth/"

export function getAssignedPermissionsAPI(params) {
    return http.get(`${resquest}` + `getPermissions`, params)
}

export function updatePermissionsAPI(params) {
    return http.post(`${resquest}` + `updatePermissions`, params)
}