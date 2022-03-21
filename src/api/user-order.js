import http from "../utils/http";

let resquest = "/adminIp/userOrder/"

export function listUserOrderAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function listUserDateOrderAPI(params){
    return http.get(`${resquest}`+`dateList`,params)
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
