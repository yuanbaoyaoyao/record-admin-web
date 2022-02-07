import http from "../utils/http";

let resquest = "/testIp/upload/"

export function getToken(params){
    return http.get(`${resquest}`+'qiniu/policy',params)
}