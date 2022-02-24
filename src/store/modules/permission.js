import { asyncRoutes,constantRoutes } from "../../router";

function hasPermission(permission,route){
    if(route.meta&&route.meta.permission){
        return permission.some(permission=>route.meta.permission.includes(permission))
    }else{
        return true
    }
}

function hasRole(roles,route){
    if(route.meta&&route.meta.roles){
        return route.meta.roles.indexOf(roles.id)
    }else{
        return true
    }
}

function filterAsyncRouter(routes,roles){
    const accessedRouters = routes.filter(route=>{
        if(hasPermission(roles.permissionList,route)){
            if(route.children&&route.children.length){
                route.children = filterAsyncRouter(route.children,roles)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

const permission = {
    state:{
        routes: constantRoutes,
        addRoutes:[]
    },
    mutations:{
        SET_ROUTES:(state,routes)=>{
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions:{
        GenerateRoutes({commit},data){
            return new Promise(resolve=>{
                const {roles} = data
                let accessedRouters
                accessedRouters = filterAsyncRouter(asyncRoutes,roles)
                commit('SET_ROUTERS',accessedRouters)
                resolve()
            })
        },
        UpdateAppRouter({commit},routes){
            return new Promise(resolve=>{
                let routeList = routes.constantRoutes
                commit('SET_ROUTERS',routeList)
                resolve()
            })
        }
    }
}

export default permission