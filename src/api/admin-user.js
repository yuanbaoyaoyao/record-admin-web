import http from "../utils/http";

let resquest = "/testIp/adminUser/list"

export function getListAPI(params){
    return http.get(`${resquest}`,params)
}