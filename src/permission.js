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
      NProgress.done() 
    } else {
      if (store.getters.adminPerms.length === 0) { 
        store.dispatch('GetUserInfo').then(res => { 
          const perms = res.data.perms 
          store.dispatch('GenerateRoutes', { perms }).then(() => { 
            for (let i = 0; i < store.getters.addRoutes.length; i++) {
              router.addRoute(store.getters.addRoutes[i])
            }

            next({ ...to, replace: true }) 
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        if (hasPermission(store.getters.adminPerms, to.meta.perms)) {
          next()
        }
      }
    }
  }
  else {
    console.log("has no token")
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { 
      next()
    } else {
      next(`/login?redirect=${to.path}`) 
      NProgress.done() 
    }
  }
})

router.afterEach(() => {
  NProgress.done() 
})
