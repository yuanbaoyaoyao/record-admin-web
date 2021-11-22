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
            title: '系统页面'
        },
        component: () => import("../views/Dashboard.vue")
    }]
}];

const router = createRouter({
    //路由模式带“#”号
    history: createWebHashHistory(),
    routes
})

export default router;