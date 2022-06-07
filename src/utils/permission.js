import store from '@/store'

export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const perms = store.getters && store.getters.adminPerms
    const permissions = value

    var hasPermission = false

    if (perms.indexOf('*') >= 0) {
      hasPermission = true
    } else {
      hasPermission = perms.some(perm => {
        return permissions.includes(perm)
      })
    }

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need perms! Like v-permission="['GET /aaa','POST /bbb']"`)
    return false
  }
}
