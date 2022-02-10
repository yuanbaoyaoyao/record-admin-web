import {
    createRouter,
    createWebHashHistory
} from "vue-router";
import Home from "../views/Home.vue";

const routes = [{
    path: '/',
    redirect: '/dashboard'
}, {
    path: "/",
    name: "Home",
    component: Home,
    children: [{
        path: "/dashboard",
        name: "dashboard",
        meta: {
            title: '系统首页'
        },
        component: () => import("../views/Dashboard.vue")
    }, {
        path: "/usersList",
        name: "UsersList",
        meta:{
            title:'用户列表'
        },
        component: () => import("../views/users/UsersList.vue"),

    }, {
        path: "/userTrace",
        name: "UserTrace",
        meta:{
            title:'用户足迹'
        },
        component: () => import("../views/users/UserTrace.vue"),

    },{
        path: "/ordersList",
        name: "OrdersList",
        meta:{
            title:'需求列表'
        },
        component: () => import("../views/orders/OrdersList.vue"),

    }, {
        path: "/orderDetail",
        name: "OrderDetail",
        meta:{
            title:'需求详情'
        },
        component: () => import("../views/orders/OrderDetail.vue"),

    },{
        path: "/consumablesList",
        name: "ConsumablesList",
        meta:{
            title:'耗材管理'
        },
        component: () => import("../views/consumables/ConsumablesList.vue"),

    },{
        path: "/consumableCategory",
        name: "ConsumableCategory",
        meta:{
            title:'耗材类别'
        },
        component: () => import("../views/consumables/ConsumableCategory.vue"),

    },{
        path: "/consumableDetail",
        name: "ConsumableDetail",
        meta:{
            title:'耗材详情'
        },
        component: () => import("../views/consumables/ConsumableDetail.vue"),

    }, {
        path: "/consumableApply",
        name: "ConsumableApply",
        meta:{
            title:'耗材申请'
        },
        component: () => import("../views/consumables/ConsumableApply.vue"),

    },   {
        path: "/adminsList",
        name: "adminsList",
        meta:{
            title:'管理员'
        },
        component: () => import("../views/permissions/AdminsList.vue"),

    },{
        path: "/rolesManagement",
        name: "RolesManagement",
        meta:{
            title:'角色管理'
        },
        component: () => import("../views/permissions/RolesManagement.vue"),

    },{
        path: "/operationLog",
        name: "operationLog",
        meta:{
            title:'操作日志'
        },
        component: () => import("../views/permissions/OperationLog.vue"),

    }, {
        path: "/charts",
        name: "Charts",
        meta:{
            title:'表格'
        },
        component: () => import("../views/tests/Charts.vue"),

    }, {
        path: "/3d",
        name: "3d",
        meta:{
            title:'3d'
        },
        component: () => import("../views/tests/3d.vue"),

    }, {
        path: "editor",
        name: "Editor",
        meta:{
            title:'富文本编辑器'
        },
        component: () => import("../views/tests/Editor.vue"),

    },{
        path: "editor",
        name: "Editor",
        meta:{
            title:'富文本编辑器'
        },
        component: () => import("../views/tests/Editor.vue"),
    }]
}];

const router = createRouter({
    //路由模式带“#”号
    history: createWebHashHistory(),
    routes
})

export default router;