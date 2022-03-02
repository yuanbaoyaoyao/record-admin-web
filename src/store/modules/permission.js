import { asyncRoutes, constantRoutes } from "../../router";

function hasPermission(perms, route) {
    // console.log("perms.some(permission => route.meta.perms.includes(perms))", perms.some(perms => route.meta.perms.includes(perms)))
    if (route.meta && route.meta.perms) {
        // console.log("route.meta.perms",route.meta.perms)
        // console.log("perms",perms)
        // console.log("perms.some(perm => route.meta.perms.includes(perm))",perms.some(perm => route.meta.perms.includes(perm)))
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        // console.log(route.meta)
        // console.log("调用hasPermission:true",true)
        return true
    }
}

// function hasRole(roles, route) {
//     if (route.meta && route.meta.roles) {
//         return route.meta.roles.indexOf(roles.id)
//     } else {
//         return true
//     }
// }

function filterAsyncRoutes(routes, perms) {
    const res = []
    // console.log("routes:", routes)
    // console.log("perms:", perms)

    routes.forEach(route => {
        const tmp = { ...route }
        if (tmp.children) {
            tmp.children = filterAsyncRoutes(tmp.children, perms)
            if (tmp.children && tmp.children.length > 0) {
                // console.log("res.push1")
                res.push(tmp)
            }
        } else {
            if (hasPermission(perms, tmp)) {
                // console.log("res.push2")
                res.push(tmp)
            }
        }
    })
    console.log("res", res)

    return res
}
const permission = {
    state: {
        routes: constantRoutes,
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            // console.log("constantRoutes1",constantRoutes)

            state.routes = constantRoutes.concat(routes)
            console.log("state.routes",state.routes)
            state.addRoutes = routes
            // console.log("constantRoutes2",constantRoutes)
            // console.log("state.addRoutes",state.addRoutes)
            // console.log("constantRoutes.concat(routes)",constantRoutes.concat(routes))
            // console.log("state.routes:",state.routes)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { perms } = data
                let accessedRoutes
                console.log("perms:" + perms)
                if (perms.includes('*')) {
                    accessedRoutes = asyncRoutes
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, perms)
                    console.log("accessedRoutes:", accessedRoutes)
                }
                commit('SET_ROUTES', accessedRoutes)
                console.log("constantRoutes:", constantRoutes)
                resolve()
            })
        },

    }
}

export default permission