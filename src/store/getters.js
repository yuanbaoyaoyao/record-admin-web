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
  userId: state => state.user.userId,
  name: state => state.user.name,
  roles: state => state.user.roles,
  perms: state => state.user.perms,
  addRoutes: state => state.permission.addRoutes,
  routes: state => state.permission.routes,
  editableTabs: state => state.tag.editableTabs,
  collapse: state => state.tag.collapse,
  userDetailName: state => state.statisticsDetail.userDetailName,
  userDateState: state => state.statisticsDetail.userDateState,
  userSpecifiedTime1: state => state.statisticsDetail.userSpecifiedTime1,
  userSpecifiedTime2: state => state.statisticsDetail.userSpecifiedTime2,
  // userDetailName: state => state.userStatisticsDetail.userDetailName,
  orderDateState: state => state.statisticsDetail.orderDateState,
  orderSpecifiedTime1: state => state.statisticsDetail.orderSpecifiedTime1,
  orderSpecifiedTime2: state => state.statisticsDetail.orderSpecifiedTime2,
  // userDetailName: state => state.userStatisticsDetail.userDetailName,
  consumableDateState: state => state.statisticsDetail.consumableDateState,
  consumableSpecifiedTime1: state => state.statisticsDetail.consumableSpecifiedTime1,
  consumableSpecifiedTime2: state => state.statisticsDetail.consumableSpecifiedTime2,

}
export default getters
