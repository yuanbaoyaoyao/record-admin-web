import http from "../utils/http";

let resquest = "/adminIp/frontShow/"

export function listFrontShowRotationAPI(){
    return http.get(`${resquest}`+`listRotation`)
}
export function listFrontShowOldAPI(){
    return http.get(`${resquest}`+`listOld`)
}
export function listFrontShowNewAPI(){
    return http.get(`${resquest}`+`listNew`)
}
export function createFrontShowAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function createFrontShowLimitNumberAPI(params){
    console.log("params:",params)
    return http.get(`${resquest}`+`createLimitNumber`,params)
}
export function deleteFrontShowAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}