import http from "../utils/http";

let resquest = "/adminIp/user/"

export function listUserAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function deleteUserAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateUserAPI(params){
    return http.post(`${resquest}`+`update`,params)
}
