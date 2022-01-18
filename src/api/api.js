import http from "../utils/http";

let resquest = "http://localhost:8081/adminUser/list"

export function getListAPI(params){
    return http.get(`${resquest}`,params)
}