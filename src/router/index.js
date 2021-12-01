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
        path: "/users",
        name: "Users",
        meta:{
            title:'用户管理'
        },
        component: () => import("../views/Users.vue"),

    }, {
        path: "/orders",
        name: "Orders",
        meta:{
            title:'需求单管理'
        },
        component: () => import("../views/Orders.vue"),

    }, {
        path: "/consumables",
        name: "Consumables",
        meta:{
            title:'耗材管理'
        },
        component: () => import("../views/Consumables.vue"),

    }, {
        path: "/permissions",
        name: "Permissions",
        meta:{
            title:'权限管理'
        },
        component: () => import("../views/Permissions.vue"),

    }, {
        path: "/charts",
        name: "Charts",
        meta:{
            title:'表格'
        },
        component: () => import("../views/Charts.vue"),

    }, {
        path: "/3d",
        name: "3d",
        meta:{
            title:'3d'
        },
        component: () => import("../views/3d.vue"),

    }, {
        path: "editor",
        name: "Editor",
        meta:{
            title:'富文本编辑器'
        },
        component: () => import("../views/Editor.vue"),

    },]
}];

const router = createRouter({
    //路由模式带“#”号
    history: createWebHashHistory(),
    routes
})

export default router;