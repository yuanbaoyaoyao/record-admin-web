import http from "../utils/http";

let resquest = "/testIp/adminRole/list"

export function getListAPI(){
    return http.get(`${resquest}`)
}