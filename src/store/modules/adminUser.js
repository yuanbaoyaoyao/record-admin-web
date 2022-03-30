import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { listRoleAPI } from '@/api/admin-role'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '../../utils/storage'

const adminUser = {
    state: {
        adminUser: '1',
        adminToken: getToken(),
        adminName: '',
        adminAvatar: '',
        adminRoles: [],
        adminPerms: [],
        adminUserId: '',
        adminLastLoginIp:'',
        adminLastLoginTime:'',
    },

    mutations: {
        SET_ADMIN_TOKEN: (state, adminToken) => {
            state.adminToken = adminToken
            storage.set("ADMIN_TOKEN", adminToken)
        },
        SET_ADMIN_NAME: (state, adminName) => {
            state.adminName = adminName
            storage.set("ADMIN_NAME", adminName)
        },
        SET_ADMIN_AVATAR: (state, adminAvatar) => {
            state.adminAvatar = adminAvatar
            storage.set("ADMIN_AVATAR", adminAvatar)
        },
        SET_ADMIN_ROLES: (state, adminRoles) => {
            state.adminRoles = adminRoles
            storage.set("ADMIN_ROLES", adminRoles)
        },
        SET_ADMIN_PERMS: (state, adminPerms) => {
            state.adminPerms = adminPerms
            storage.set("ADMIN_PERMS", adminPerms)
        },
        SET_ADMIN_USERID: (state, adminUserId) => {
            state.adminUserId = adminUserId
            storage.set("ADMIN_USERID", adminUserId)
        },
        SET_ADMIN_LAST_LOGIN_IP:(state,adminLastLoginIp)=>{
            state.adminLastLoginIp = adminLastLoginIp
            storage.set("ADMIN_LAST_LOGIN_IP", adminLastLoginIp)
        },
        SET_ADMIN_LAST_LOGIN_TIME:(state,adminLastLoginTime)=>{
            state.adminLastLoginTime = adminLastLoginTime
            storage.set("ADMIN_LAST_LOGIN_TIME", adminLastLoginTime)
        }
    },
    actions: {
        LoginByUsername({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                loginByUsername(username, userInfo.password, userInfo.code).then(res => {
                    console.log(res)
                    const token = res.data.token
                    commit('SET_ADMIN_TOKEN', token)
                    setToken(token)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        GetUserInfo({ commit, state }) {
            console.log("调用了获取用户信息")
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(res => {
                    const data = res.data
                    console.log("data", data)
                    if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
                        commit('SET_ADMIN_PERMS', data.perms)
                    } else {
                        reject('getInfo: perms must be a non-null array !')
                    }
                    commit('SET_ADMIN_ROLES', data.role)
                    commit('SET_ADMIN_NAME', data.name)
                    commit('SET_ADMIN_AVATAR', data.avatar)
                    commit('SET_ADMIN_USERID', data.adminUserId)
                    commit('SET_ADMIN_LAST_LOGIN_IP',data.lastLoginIp)
                    commit('SET_ADMIN_LAST_LOGIN_TIME',data.lastLoginTime)

                    // console.log("dataaaaaaaaaaaaaaaa:",data)
                    // listRoleAPI(data.adminRoleId).then(res=>{
                    //     console.log("resssssssssssssssss",res)
                    //     commit('SET_ADMIN_ROLES',res.data.records.name)
                    // })
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut({ commit, state, dispatch }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_ADMIN_TOKEN', '')
                    commit('SET_ADMIN_ROLES', [])
                    commit('SET_ADMIN_PERMS', [])
                    removeToken()
                    resetRouter()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_ADMIN_TOKEN', '')
                commit('SET_ADMIN_ROLES', [])
                removeToken()
                resolve()
            })
        },

        // 动态修改权限
        ChangeRoles({ commit, dispatch }, role) {
            return new Promise(async resolve => {
                commit('SET_ADMIN_TOKEN', role)
                setToken(role)
                const { roles } = await dispatch('GetUserInfo')
                resetRouter()
                const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
                // dynamically add accessible routes
                router.addRoutes(accessRoutes)
                // reset visited views and cached views
                dispatch('tagsView/delAllViews', null, { root: true })

                resolve()
            })
        }
    }
}

export default adminUser