import http from "../utils/http";

let resquest = "/adminIp/userOrder/"

export function listUserOrderAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function listUserDateOrderAPI(params){
    return http.get(`${resquest}`+`dateList`,params)
}
export function listUserDateOrderCountAPI(params){
    return http.get(`${resquest}`+`dateListCount`,params)
}
export function listUserDateOrderNoGroupAPI(params){
    return http.get(`${resquest}`+`dateListNoGroup`,params)
}
export function listUserDateOrderAllListAPI(params){
    return http.get(`${resquest}`+`dateListAll`,params)
}
export function listUserDateOrderAllListDayAPI(params){
    return http.get(`${resquest}`+`dateListAllDay`,params)
}
export function listUserDateOrderAllListMonthAPI(params){
    return http.get(`${resquest}`+`dateListAllMonth`,params)
}
// export function createUserOrderAPI(params){
//     return http.post(`${resquest}`+`create`,params)
// }
// export function deleteUserOrderAPI(params){
//     return http.delete(`${resquest}`+`delete`,params)
// }
export function updateUserOrderAPI(params){
    return http.put(`${resquest}`+`update`,params)
}
