import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_AUTH, SYS_BUTTON_AUTH, UI_CACHE_DB_DICT_DATA, TENANT_ID, CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"
import storage from "../../utils/storage"
import { loginByUsername, logout, getUserInfo } from '@/api/login'

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
        // ValidateLogin({ commit }, userInfo) {
        //     return new Promise((resolve, reject) => {
        //         http.get(`??`, userInfo).then(respose => {
        //             if (respose.success) {
        //                 const result = respose.result
        //                 const userInfo = result.userInfo
        //                 storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
        //                 commit('SET_TOKEN', result.token)
        //                 commit('SET_INFO', userInfo)
        //                 commit('SET_NAME', { username: userInfo.username })
        //                 commit('SET_AVATAR', userInfo.avatar)
        //                 resolve(respose)
        //             } else {
        //                 resolve(respose)
        //             }
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        // Login({ commit }, userInfo) {
        //     return new Promise((resolve, reject) => {
        //         login(userInfo).then(response => {
        //             if (response.code == '200') {
        //                 const result = response.result
        //                 const userInfo = result.userInfo
        //                 storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(UI_CACHE_DB_DICT_DATA, result.sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
        //                 commit('SET_TOKEN', result.token)
        //                 commit('SET_INFO', userInfo)
        //                 commit('SET_NAME', { username: userInfo.username })
        //                 commit('SET_AVATAR', userInfo.avatar)
        //                 resolve(response)
        //             } else {
        //                 reject(response)
        //             }
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
            // 用户名登录
    LoginByUsername({ commit }, userInfo) {
        const username = userInfo.username.trim()
        return new Promise((resolve, reject) => {
          loginByUsername(username, userInfo.password, userInfo.code).then(response => {
            const token = response.data.data.token
            commit('SET_TOKEN', token)
            setToken(token)
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
  
      // 获取用户信息
      GetUserInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
          getUserInfo(state.token).then(response => {
            const data = response.data.data
  
            if (data.perms && data.perms.length > 0) { // 验证返回的perms是否是一个非空数组
              commit('SET_PERMS', data.perms)
            } else {
              reject('getInfo: perms must be a non-null array !')
            }
  
            commit('SET_ROLES', data.roles)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      },
          // 登出
    LogOut({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
          logout(state.token).then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMS', [])
            removeToken()
            resetRouter()
  
            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })
  
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
  
      // 前端 登出
      FedLogOut({ commit }) {
        return new Promise(resolve => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        })
      },
  
      // 动态修改权限
      ChangeRoles({ commit, dispatch }, role) {
        return new Promise(async resolve => {
          commit('SET_TOKEN', role)
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
        // GetPermissionList({ commit }) {
        //     return new Promise((resolve, reject) => {
        //         queryPermissionsByUser().then(response => {
        //             const menuData = response.result.menu
        //             const authData = response.result.auth
        //             const allAuthData = response.result.allAuth
        //             sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
        //             sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
        //             if (menuData && menuData.length > 0) {
        //                 commit('SET_PERMISSIONLIST', menuData)
        //             } else {
        //                 reject('getPermissionList:permissions must be a non-null array!')
        //             }
        //             resolve(response)
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        // Logout({ commit, state }) {
        //     return new Promise((resolve, reject) => {
        //         let logoutToken = state.token
        //         commit('SET_TOKEN', '')
        //         commit('SET_PERMISSIONLIST', [])
        //         Vue.ls.remove(ACCESS_TOKEN)
        //         Vue.ls.remove(USER_INFO)
        //         Vue.ls.remove(USER_NAME)
        //         Vue.ls.remove(UI_CACHE_DB_DICT_DATA)
        //         Vue.ls.remove(CACHE_INCLUDED_ROUTES)
        //         Vue.ls.remove(TENANT_ID)
        //         logoutToken(logoutToken).then(() => {
        //             if (process.env.VUE_APP_SSO == 'true') {
        //                 let service = 'http://' + window.location.host + '/'
        //                 let serviceUrl = encodeURIComponent(service)
        //                 window.location.href = process.env.VUE_APP_CAS_BASE_URL + '/logout?service=' + serviceUrl
        //             }
        //             resolve()
        //         }).catch(() => {
        //             resolve()
        //         })
        //     })
        // },
        // ThirdLogin({ commit }, param) {
        //     return new Promise((resolve, reject) => {
        //         this.ThirdLogin(param.token.thirdType).then(response => {
        //             if (response.code == '200') {
        //                 const result = response.result
        //                 const userInfo = result.userInfo
        //                 storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
        //                 storage.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
        //                 commit('SET_TOKEN', result.token)
        //                 commit('SET_INFO', userInfo)
        //                 commit('SET_NAME', { username: userInfo.username })
        //                 commit('SET_AVATAR', userInfo.avatar)
        //                 resolve(response)
        //             } else {
        //                 reject(response)
        //             }
        //         }).catch(error => {
        //             reject(error)
        //         })
        //     })
        // },
        // saveTenant({ commit }, id) {
        //     storage.set(TENANT_ID, id, 7 * 24 * 60 * 60 * 1000)
        //     commit('SET_TENANT', id)
        // }
    }
}

export default user