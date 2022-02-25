import http from "../utils/http";

let resquest = "/adminIp/upload/"

export function getToken(params){
    return http.get(`${resquest}`+'qiniu/policy',params)
}