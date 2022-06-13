import http from "../utils/http";

let resquest = "/adminIp/adminReminder/"

export function listAdminReminderAPI(params) {
    return http.get(`${resquest}` + `list`, params)
}

export function updateAdminReminderAPI(params) {
    return http.put(`${resquest}` + `update`, params)
}

export function updateAdminReminderListAPI(params) {
    return http.put(`${resquest}` + `updateByIds`, params)
}

export function deleteAdminReminderAPI(params) {
    return http.delete(`${resquest}` + `delete`, params)
}

export function deleteAdminReminderListAPI(params) {
    return http.delete(`${resquest}` + `deleteByIds`, params)
}