import http from "../utils/http";

let resquest = "/adminIp/orderProduct/"

export function listOrderProductAPI(params) {
    return http.get(`${resquest}` + `list`, params)
}

export function listOrderProductWithReceiverAPI(params) {
    return http.get(`${resquest}` + `listWithReceiver`, params)
}

export function listDateOrderNoGroupAPI(params) {
    return http.get(`${resquest}` + `dateList`, params)
}

export function listDateOrderProductCountNoGroupAPI(params) {
    return http.get(`${resquest}` + `dateProductCountList`, params)
}

export function listDateOrderProductCountNoGroupAllListAPI(params) {
    return http.get(`${resquest}` + `dateProductCountAllList`, params)
}