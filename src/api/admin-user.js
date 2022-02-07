import http from "../utils/http";

let resquest = "/testIp/adminUser/"

export function listAdminAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function createAdminAPI(params){
    return http.post(`${resquest}`+`create`,params)
}