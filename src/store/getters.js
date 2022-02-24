const getters = {
    token:state=>state.user.token,
    username:state=>state.user.username,
    avatar:state=>state.user.avatar,
    permissionList: state=>state.user.permissionList,
    collapse:state=>state.tag.collapse,
    editableTabs:state=>state.tag.editableTabs,
    token:state=>state.tag.token,
}

export default getters