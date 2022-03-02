import Cookies from 'js-cookie'

const TokenKey = 'X-Record-Admin-Token'

export function getToken() {
  console.log("调用getToken")
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log("调用setToken")
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  console.log("调用removeToken")
  return Cookies.remove(TokenKey)
}
