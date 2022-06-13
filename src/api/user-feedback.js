import http from "../utils/http";

let resquest = "/adminIp/userFeedback/"

export function listUserFeedbackAPI(params) {
    return http.get(`${resquest}` + `list`, params)
}

export function updateUserFeedbackAPI(params) {
    return http.put(`${resquest}` + `update`, params)
}