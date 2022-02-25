import http from "../utils/http";

let resquest = "/adminIp/adminUser/"

export function listAdminAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function createAdminAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function deleteAdminAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateAdminAPI(params){
    return http.post(`${resquest}`+`update`,params)
}