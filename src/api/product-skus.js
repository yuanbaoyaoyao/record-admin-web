import http from "../utils/http";

let resquest = "/adminIp/productSkus/"

export function listProductSkusAPI(params){
    return http.get(`${resquest}`+`list`,params)
}
export function createProductSkusAPI(params){
    return http.post(`${resquest}`+`create`,params)
}
export function deleteProductSkusAPI(params){
    return http.delete(`${resquest}`+`delete`,params)
}
export function updateProductSkusAPI(params){
    return http.post(`${resquest}`+`update`,params)
}
