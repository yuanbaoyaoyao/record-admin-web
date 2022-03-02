// const getters = {
//     token:state=>state.user.token,
//     username:state=>state.user.username,
//     avatar:state=>state.user.avatar,
//     permissionList: state=>state.user.permissionList,
//     collapse:state=>state.tag.collapse,
//     editableTabs:state=>state.tag.editableTabs,
//     token:state=>state.tag.token,
// }

// export default getters

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  addRoutes: state => state.permission.addRoutes,
  routes: state => state.permission.routes,
  editableTabs: state => state.tag.editableTabs,
  collapse: state => state.tag.collapse,
}
export default getters
