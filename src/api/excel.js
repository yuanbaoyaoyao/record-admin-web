import http from "../utils/http";

let resquest = "/adminIp/excel/"

export function listAllProductSkusURL(){
    return (`${resquest}`+`productSkus`)
}
export function listAllUserStatisticsURL(){
    return (`${resquest}`+`userStatistics`)
}