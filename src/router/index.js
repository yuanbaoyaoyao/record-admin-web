import {
    createWebHashHistory,
    createRouter
} from "vue-router";
import Layout from "../components/Layout/Home.vue";

export const constantRoutes = [
    {
        path: '/login',
        meta: {
            title: "登录",
            hidden: true,
            hiddenTab: true
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
        component: Layout,
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

            },
        ]
    },
    {
        path: '/order',
        component: Layout,
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
                    title: '需求列表'
                },
                component: () => import("../views/orders/OrdersList.vue"),

            }, {
                path: "/orderDetail",
                name: "OrderDetail",
                meta: {
                    perms: ['GET /order/ordersDetail'],
                    title: '需求详情'
                },
                component: () => import("../views/orders/OrderDetail.vue"),

            },
        ]
    },
    {
        path: '/consumables',
        component: Layout,
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
                    title: '耗材管理'
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
                path: "/consumableDetail",
                name: "ConsumableDetail",
                meta: {
                    perms: ['GET /product/list'],
                    title: '耗材详情'
                },
                component: () => import("../views/consumables/ConsumableDetail.vue"),

            }, {
                path: "/consumableApply",
                name: "ConsumableApply",
                meta: {
                    perms: ['GET /consumables/consumableApply'],
                    title: '耗材申请'
                },
                component: () => import("../views/consumables/ConsumableApply.vue"),

            },
        ]
    },
    {
        path: '/admin',
        component: Layout,
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
    {
        path: '/test',
        component: Layout,
        redirect: '/test/charts',
        name: 'testManage',
        meta: {
            title: '测试管理',
            icon: "fas fa-vials fa-2x fa-fw",
        },
        children: [
            {
                path: "/charts",
                name: "Charts",
                meta: {
                    perms: ['GET /test/charts'],
                    title: '表格'
                },
                component: () => import("../views/tests/Charts.vue"),

            }, {
                path: "/3d",
                name: "3d",
                meta: {
                    perms: ['GET /test/3d'],
                    title: '3d'
                },
                component: () => import("../views/tests/3d.vue"),

            }, {
                path: "editor",
                name: "Editor",
                meta: {
                    perms: ['GET /test/editor'],
                    title: '富文本编辑器'
                },
                component: () => import("../views/tests/Editor.vue"),

            },
        ]
    }
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