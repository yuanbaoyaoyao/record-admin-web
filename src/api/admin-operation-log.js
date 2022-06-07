import http from "../utils/http";

let resquest = "/adminIp/adminOperationLog/"

export function listOperationLogAPI(params){
    return http.get(`${resquest}`+`list`,params)
}