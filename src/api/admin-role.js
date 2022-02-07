import http from "../utils/http";

let resquest = "/testIp/adminRole/list"

export function listRoleAPI(params){
    return http.get(`${resquest}`,params)
}