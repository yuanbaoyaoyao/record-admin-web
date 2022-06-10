import http from "../utils/http";

let resquest = "/adminIp/userFeedbackDetail/"

export function listUserFeedbackDetailAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function createUserFeedbackDetailAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
