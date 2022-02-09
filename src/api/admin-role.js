import http from "../utils/http";

let resquest = "/testIp/adminRole/"

export function listRoleAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function createRoleAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function deleteRoleAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateRoleAPI(params){
    return http.post(`${resquest}`+`update`,params)
}