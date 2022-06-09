import http from "../utils/http";

let resquest = "/adminIp/product/"

export function listProductAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function listProductAllAPI(params){
    return http.get(`${resquest}`+`listAll`,params)
}

export function createProductAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function deleteProductAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateProductAPI(params){
    return http.post(`${resquest}`+`update`,params)
}