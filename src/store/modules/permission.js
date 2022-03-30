import { asyncRoutes, constantRoutes } from "../../router";

function hasPermission(perms, route) {
    if (route.meta && route.meta.perms) {
        return perms.some(perm => route.meta.perms.includes(perm))
    } else {
        return true
    }
}

function filterAsyncRoutes(routes, perms) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (tmp.children) {
            tmp.children = filterAsyncRoutes(tmp.children, perms)
            if (tmp.children && tmp.children.length > 0) {
                res.push(tmp)
            }
        } else {
            if (hasPermission(perms, tmp)) {
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

            state.routes = constantRoutes.concat(routes)
            state.addRoutes = routes
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { perms } = data
                let accessedRoutes
                if (perms.includes('*')) {
                    accessedRoutes = asyncRoutes
                } else {
                    accessedRoutes = filterAsyncRoutes(asyncRoutes, perms)
                }
                commit('SET_ROUTES', accessedRoutes)
                resolve()
            })
        },

    }
}

export default permission