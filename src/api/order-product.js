import http from "../utils/http";

let resquest = "/adminIp/orderProduct/"

export function listOrderProductAPI(params){
    return http.get(`${resquest}`+`list`,params)
}

export function listDateOrderNoGroupAPI(params){
    return http.get(`${resquest}`+`dateList`,params)
}