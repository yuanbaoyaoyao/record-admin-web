import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_AUTH, SYS_BUTTON_AUTH, UI_CACHE_DB_DICT_DATA, TENANT_ID, CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"

const user = {
    state: {
        token: '',
        username: '',
        avatar: '',
        permissionList: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, username) => {
            state.username = username
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_PERMISSIONLIST: (state, permissionList) => {
            state.permissionList = permissionList
        }
    },
    actions: {
        ValidateLogin({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                http.get(`??`, userInfo).then(respose => {
                    if (respose.success) {
                        const result = respose.result
                        const userInfo = result.userInfo
                        Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
                        commit('SET_TOKEN', result.token)
                        commit('SET_INFO', userInfo)
                        commit('SET_NAME', { username: userInfo.username })
                        commit('SET_AVATAR', userInfo.avatar)
                        resolve(respose)
                    } else {
                        resolve(respose)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        Login({ commit }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    if (response.code == '200') {
                        const result = response.result
                        const userInfo = result.userInfo
                        Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
                        Vue.ls.set(UI_CACHE_DB_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
                        commit('SET_TOKEN', result.token)
                        commit('SET_INFO', userInfo)
                        commit('SET_NAME', { username: userInfo.username})
                        commit('SET_AVATAR', userInfo.avatar)
                        resolve(response)
                    } else {
                        reject(response)
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetPermissionList({commit}){
            return new Promise((resolve,reject)=>{
                query
            })
        }
    }
}