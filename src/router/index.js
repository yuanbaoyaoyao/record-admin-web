import {
    createWebHashHistory,
    createRouter
} from "vue-router";
import Layout from "../components/Layout/Home.vue";
import { shallowRef } from "vue";

export const constantRoutes = [
    {
        path: '/login',
        meta: {
            title: "登录",
            hidden: true,
        },
        component: () => import('../views/login/index.vue'),
    },
    {
        path: "",
        name: "Home",
        component: Layout,
        redirect: '/dashboard',
        meta: {
            title: "首页"
        },
        children: [{
            path: "/dashboard",
            name: "dashboard",
            meta: {
                title: '系统首页',
                icon: 'fas fa-chart-line fa-2x fa-fw'
            },
            component: () => import("../views/Dashboard.vue")
        },
        ]
    },
]

export const asyncRoutes = [

    {
        path: '/user',
        component: shallowRef(Layout),
        redirect: '/user/usersList',
        name: 'userManage',
        meta: {
            title: '用户管理',
            icon: 'fas fa-users fa-2x fa-fw'
        },
        children: [
            {
                path: "/usersList",
                name: "UsersList",
                meta: {
                    perms: ['GET /user/usersList'],
                    title: '用户列表'
                },
                component: () => import("../views/users/UsersList.vue"),

            }, {
                path: "/userTrace",
                name: "UserTrace",
                meta: {
                    perms: ['GET /user/usersTrace'],
                    title: '用户足迹'
                },
                component: () => import("../views/users/UserTrace.vue"),

            }, {
                path: "/usersFeedback",
                name: "UsersFeedback",
                meta: {
                    perms: ['GET /user/usersFeedback'],
                    title: '用户反馈'
                },
                component: () => import("../views/users/UsersFeedback.vue"),
            }, {
                path: "/userStatistics",
                name: "UserStatistics",
                meta: {
                    perms: ['GET /user/userStatistics'],
                    title: '用户统计'
                },
                component: () => import("../views/users/UserStatistics.vue"),
            }, {
                path: "/userStatisticsDetail",
                name: "UserStatisticsDetail",
                meta: {
                    perms: ['GET /user/userStatistics'],
                    title: '用户统计详情',
                    hidden: true,
                },
                component: () => import("../views/users/UserStatisticsDetail.vue"),
            },
        ]
    },
    {
        path: '/order',
        component: shallowRef(Layout),
        redirect: '/order/ordersList',
        name: 'orderManage',
        meta: {
            title: '需求管理',
            icon: "fas fa-file-alt fa-2x fa-fw",
        },
        children: [
            {
                path: "/ordersList",
                name: "OrdersList",
                meta: {
                    perms: ['GET /order/ordersList'],
                    // title: '需求列表'
                    title: '需求管理',
                    icon: "fas fa-file-alt fa-2x fa-fw",
                },
                component: () => import("../views/orders/OrdersList.vue"),

            }, {
                path: "/orderDetail",
                name: "OrderDetail",
                meta: {
                    perms: ['GET /order/ordersDetail'],
                    title: '需求详情',
                    hidden: true,
                },
                component: () => import("../views/orders/OrderDetail.vue"),

            },
            // {
            //     path: "/orderStatistics",
            //     name: "OrderStatistics",
            //     meta: {
            //         perms: ['GET /order/ordersList'],
            //         title: '需求统计'
            //     },
            //     component: () => import("../views/orders/orderStatistics.vue"),
            // },
        ]
    },
    {
        path: '/consumables',
        component: shallowRef(Layout),
        redirect: '/consumables/consumablesList',
        name: 'consumablesManage',
        meta: {
            title: '耗材管理',
            icon: "fas fa-wrench fa-2x fa-fw",
        },
        children: [
            {
                path: "/consumablesList",
                name: "ConsumablesList",
                meta: {
                    perms: ['GET /productSku/list', 'POST /productSku/create', 'DELETE /productSku/delete', 'PUT /productSku/update'],
                    title: '耗材列表'
                },
                component: () => import("../views/consumables/ConsumablesList.vue"),

            }, {
                path: "/consumableCategory",
                name: "ConsumableCategory",
                meta: {
                    perms: ['GET /product/list', 'POST /product/create', 'DELETE /product/delete', 'PUT /product/update'],
                    title: '耗材类别'
                },
                component: () => import("../views/consumables/ConsumableCategory.vue"),

            }, {
                path: "/consumableStatistics",
                name: "ConsumableStatistics",
                meta: {
                    perms: ['GET /product/list'],
                    title: '耗材统计'
                },
                component: () => import("../views/consumables/ConsumableStatistics.vue"),
            }, {
                path: "/consumableStatisticsDetail",
                name: "ConsumableStatisticsDetail",
                meta: {
                    perms: ['GET /product/list'],
                    title: '耗材统计详情 ',
                    hidden: true
                },
                component: () => import("../views/consumables/ConsumableStatisticsDetail.vue"),
            },
        ]

    },
    {
        path: '/pages',
        component: shallowRef(Layout),
        redirect: '/pages/pagesManagement',
        name: 'pagesManagement',
        meta: {
            title: '页面管理',
            icon: "fas fa-image fa-2x fa-fw",
        },
        children: [
            {
                path: "/pagesManagement",
                name: "PagesManagement",
                meta: {
                    perms: ['GET /pages/pagesManagement'],
                    title: '页面管理',
                    icon: "fas fa-image fa-2x fa-fw",
                },
                component: () => import("../views/pages/pagesManagement.vue"),
            }
        ]
    },
    {
        path: '/admin',
        component: shallowRef(Layout),
        redirect: '/admin/adminsList',
        name: 'adminManage',
        meta: {
            title: "权限管理",
            icon: "fas fa-ban fa-2x fa-fw",
        },
        children: [
            {
                path: "/adminsList",
                name: "adminsList",
                meta: {
                    perms: ['GET /admin/adminsList'],
                    title: '管理员'
                },
                component: () => import("../views/permissions/AdminsList.vue"),

            }, {
                path: "/rolesManagement",
                name: "RolesManagement",
                meta: {
                    perms: ['GET /admin/rolesManagement'],
                    title: '角色管理'
                },
                component: () => import("../views/permissions/RolesManagement.vue"),

            }, {
                path: "/operationLog",
                name: "operationLog",
                meta: {
                    perms: ['GET /admin/operationLog'],
                    title: '操作日志'
                },
                component: () => import("../views/permissions/OperationLog.vue"),

            },
        ]
    },
]

const router = createRouter({
    //路由模式带“#”号
    history: createWebHashHistory(),
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

export function resetRouter() {
    const newRouter = createRouter({
        //路由模式带“#”号
        history: createWebHashHistory(),
        scrollBehavior: () => ({ y: 0 }),
        routes: constantRoutes
    })
    router.matcher = newRouter.matcher // reset router
}

export default router;