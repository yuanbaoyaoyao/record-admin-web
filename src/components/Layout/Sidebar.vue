<template>
  <div class="sidebar">
    <el-menu
      :default-active="onRoutes"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      :collapse="collapse"
      unique-opened
      router
    >
      <template v-for="menu in menus">
        <template v-if="menu.subs">
          <el-sub-menu :index="menu.index" :key="menu.index">
            <template #title>
              <div>
                <i class="icon" :class="menu.icon"></i>
              </div>
              <span class="title">{{ menu.title }}</span>
            </template>
            <template v-for="subMenu in menu.subs">
              <el-sub-menu v-if="subMenu.subs" :index="subMenu.index" :key="subMenu.index">
                <template #title>
                  <span class="title">{{ subMenu.title }}</span>
                </template>
                <el-menu-item v-for="(third, i) in subMenu.subs" :index="third.index" :key="i">
                  <span class="title">{{ third.title }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="subMenu.index" :key="subMenu.index">
                <span class="title">{{ subMenu.title }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-else>
          <el-menu-item :index="menu.index" :key="menu.index">
            <!-- 解决抖动问题 -->
            <div>
              <i class="icon" :class="menu.icon"></i>
            </div>
            <template #title>
              <span class="title">{{ menu.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>


<script setup>
import { computed } from 'vue'
import { useStore } from "vuex";
import { useRoute } from 'vue-router';

const menus = [
  {
    icon: "fas fa-chart-line fa-2x fa-fw",
    index: "/dashboard",
    title: "系统首页"
  },
  {
    icon: "fas fa-users fa-2x fa-fw",
    index: "/users",
    title: "用户管理",
    subs: [
      {
        index: "/users/usersList",
        title: "用户列表"
      },
      {
        index: "/userTrace",
        title: "用户足迹"
      },
    ]
  },
  {
    icon: "fas fa-file-alt fa-2x fa-fw",
    index: "/orders",
    title: "需求管理",
    subs: [
      {
        index: "/ordersList",
        title: "需求列表"
      },
      {
        index: "/orderDetail",
        title: "需求详情"
      },
    ]
  },
  {
    icon: "fas fa-wrench fa-2x fa-fw",
    index: "/consumables",
    title: "耗材管理",
    subs: [
      {
        index: "/consumablesList",
        title: "耗材列表"
      },
      {
        index: "/consumableCategory",
        title: "耗材类别"
      },
      {
        index: "/consumableDetail",
        title: "耗材详情"
      },
      {
        index: "/consumableApply",
        title: "耗材申请"
      },
    ]
  },
  {
    icon: "fas fa-ban fa-2x fa-fw",
    index: "/permissions",
    title: "权限管理",
    subs: [
      {
        index: "/adminsList",
        title: "管理员"
      },
      {
        index: "/rolesManagement",
        title: "角色管理"
      },
      {
        index: "/operationLog",
        title: "操作日志"
      },
    ]
  },
  {
    icon: "fas fa-vials fa-2x fa-fw",
    index: "/tests",
    title: "测试功能",
    subs: [
      {
        index: "/charts",
        title: "表格"
      },
      {
        index: "/3d",
        title: "3d"
      },
      {
        index: "4",
        title: "三级菜单",
        subs: [
          {
            index: "/editor",
            title: "富文本编辑器",
          },
        ],
      },
    ]
  },
]

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
})

const store = useStore();
const collapse = computed(() => store.getters.collapse);

</script>

<style scoped>
.icon {
  display: block;
  margin: 14px;
  /* margin-top: 2px; */
}
.sidebar {
  position: absolute;
  top: 80px;
  left: -10px;
  overflow-y: auto;
  height: 100%;
}
/* 设置后侧边栏收缩高度才能占满屏幕 */
/* 此处控制侧边栏收缩后样式 */
.sidebar > ul {
  position: relative;
  height: 100%;
  min-width: 90px;
}
.title {
  font-size: 15px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}
</style>