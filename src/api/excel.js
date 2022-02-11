import http from "../utils/http";

let resquest = "/testIp/excel/"

export function listAllProductSkusURL(){
    return (`${resquest}`+`productSkus`)
}