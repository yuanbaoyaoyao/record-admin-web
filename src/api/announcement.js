import http from "../utils/http";

let resquest = "/adminIp/announcement/"

export function listAnnouncementAPI(){
    return http.get(`${resquest}`+`list`)
}
export function createAnnouncementAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function deleteAnnouncementAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateAnnouncementAPI(params){
    return http.put(`${resquest}`+`update`,params)
}