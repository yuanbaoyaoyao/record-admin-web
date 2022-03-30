import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth' 
import { computed } from '@vue/reactivity'
import storage from '../src/utils/storage'
import store from './store'

NProgress.configure({ showSpinner: false })

function hasPermission(perms, permissions) {
  if (perms.indexOf('*') >= 0) return true 
  if (!permissions) return true
  return perms.some(perm => permissions.indexOf(perm) >= 0)
}

const whiteList = ['/login', '/auth-redirect']// no redirect whitelist
const editableTabs = computed(() => store.getters.editableTabs);
const userDetailName = computed(() => {
  if (store.getters.userDetailName != '') {
    return store.getters.userDetailName
  } else {
    return storage.get("USER_DETAIL_NAME")
  }
})

const addTags = (route) => {
  const isExist = editableTabs.value.some((menu) => {
    return menu.name === route.name;
  })
  const isNoName = editableTabs.value.some((menu) => {
    return menu.name === undefined;
  })
  if (!isExist && route.meta.title != '登录') {
    if (route.meta.title == '用户统计详情') {

      store.commit("HANDLE_ADD_TAGS", {
        name: route.name,
        title: userDetailName.value + route.meta.title,
        path: route.fullPath
      })
    } else {
      store.commit("HANDLE_ADD_TAGS", {
        name: route.name,
        title: route.meta.title,
        path: route.fullPath
      })
    }
  }
  if (isExist) {
    if (route.meta.title == '用户统计详情') {
      for (var i = 0; i < editableTabs.value.length; i++) {
        if (editableTabs.value[i].path === route.fullPath) {
          store.commit("HANDLE_CHANGE_TAGS", {
            i,
            name: route.name,
            title: userDetailName.value + route.meta.title,
            path: route.fullPath

          });
          break;
        }
      }
    }
  }
  if (isNoName) {
    var tabIndex, delItem;
    for (var i = 0; i < editableTabs.value.length; i++) {
      if (editableTabs.value[i].title === undefined) {
        delItem = editableTabs.value[i];
        tabIndex = i;
        store.commit("HANDLE_DELETE_TAGS", { i });
        break;
      }
    }
  }
}

router.beforeEach((to, from, next) => {
  addTags(to)

  NProgress.start() 
  if (getToken()) { 
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.adminPerms.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          const perms = res.data.perms // note: perms must be a array! such as: ['GET /aaa','POST /bbb']
          console.log("perms:", perms)
          store.dispatch('GenerateRoutes', { perms }).then(() => { // 根据perms权限生成可访问的路由表
            for (let i = 0; i < store.getters.addRoutes.length; i++) {
              router.addRoute(store.getters.addRoutes[i])
            }

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
        if (hasPermission(store.getters.adminPerms, to.meta.perms)) {
          next()
        }
      }
    }
  }
  else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
