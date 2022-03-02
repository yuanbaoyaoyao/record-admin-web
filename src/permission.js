// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
// import { OAUTH2_LOGIN_PAGE_PATH, ACCESS_TOKEN, INDEX_MAIN_PAGE_PATH } from '@/store/mutation-types'
// import router from './router'
// import store from './store'
// import storage from './utils/storage'
// import { isOAuth2AppEnv } from './utils/util'

// NProgress.configure({ showSpinner: false })

// const whiteList = ['/login']
// whiteList.push(OAUTH2_LOGIN_PAGE_PATH)

// router.beforeEach((to, from, next) => {
//     NProgress.start()

//     if (storage.get(ACCESS_TOKEN)) {
//         if (to.path === '/login' || to.path === OAUTH2_LOGIN_PAGE_PATH) {
//             next({ path: INDEX_MAIN_PAGE_PATH })
//             NProgress.done()
//         } else {
//             if (store.getters.permissionList.length === 0) {
//                 store.dispatch('GetPermissionList').then(res => {
//                     const menuData = res.result.menu;
//                     if (menuData === null || menuData === "" || menuData === undefined) {
//                         return;
//                     }
//                     let constRoutes = [];
//                     constRoutes = generateIndexRouter(menuData)
//                     store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
//                         router.addRoute(store.getters.addRoutes)
//                         const redirect = decodeURIComponent(from.query.redirect || to.path)
//                         if (to.path === redirect) {
//                             next({ ...to, replace: true })
//                         } else {
//                             next({ path: redirect })
//                         }
//                     })
//                 }).catch(() => {
//                     store.dispatch('Logout').then(() => {
//                         next({ path: '/login', query: { redirect: to.fullPath } })
//                     })
//                 })
//             } else {
//                 next()
//             }
//         }
//     }
//     else {
//         if (whiteList.indexOf(to.path) !== -1) {
//             if (to.path === '/login' && isOAuth2AppEnv()) {
//                 next({ path: OAUTH2_LOGIN_PAGE_PATH })
//             } else {
//                 next()
//             }
//             NProgress.done()
//         } else {
//             let path = isOAuth2AppEnv() ? OAUTH2_LOGIN_PAGE_PATH : '/login'
//             next({ path: path, query: { redirect: to.fullPath } })
//             NProgress.done()
//         }
//     }
// })
// router.afterEach(() => {
//     NProgress.done()
// })

import router from './router'
import store from './store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permission judge function
function hasPermission(perms, permissions) {
  if (perms.indexOf('*') >= 0) return true // admin permission passed directly
  if (!permissions) return true
  return perms.some(perm => permissions.indexOf(perm) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  console.log("router.beforeEach")
  NProgress.start() // start progress bar
  console.log("getToken", getToken())
  if (getToken()) { // determine if there has token
    console.log("有token")
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      console.log("不是去login")
      if (store.getters.perms.length === 0) { // 判断当前用户是否已拉取完user_info信息
        console.log("没有拉取完user_info")
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          console.log("res.data", res.data)
          const perms = res.data.perms // note: perms must be a array! such as: ['GET /aaa','POST /bbb']
          console.log("已经复制完perms")
          store.dispatch('GenerateRoutes', { perms }).then(() => { // 根据perms权限生成可访问的路由表
            console.log("生成可访问路由")
            // router.addRoute(store.getters.addRoutes) // 动态添加可访问路由表
            // // console.log("router",router)
            // console.log("router.option.routes",router.options.routes)
            // console.log("router.option.routes",router.options.routes)
            for (let i = 0; i < store.getters.addRoutes.length; i++) {
              console.log(store.getters.addRoutes[i])
              router.addRoute(store.getters.addRoutes[i])
            }
            // console.log("store.getters.addRoutes", store.getters.addRoutes[0])

            console.log("路由生成完毕")
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            ElMessage.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.perms, to.meta.perms)) {
          next()
        }
        // else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true } })
        // }
        // 可删 ↑
      }
    }
  }
  else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      console.log("to.path", to.path)
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
