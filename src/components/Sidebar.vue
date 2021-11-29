<template>
  <div class="sidebar">
    <el-menu
      default-active="3"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      :collapse="collapse"
      unique-opened
      @open="handleOpen"
      @close="handleClose"
    >
      <template v-for="menu in menus">
        <template v-if="menu.subs">
          <el-sub-menu :index="menu.index" :key="menu.index">
            <template #title>
              <i class="icon" :class="menu.icon"></i>
              <span class="title">{{ menu.title }}</span>
            </template>
            <template v-for="subMenu in menu.subs">
              <el-sub-menu v-if="subMenu.subs" :index="subMenu.index" :key="subMenu.index">
                <template #title>
                  <span class="title">{{ subMenu.title }}</span>
                </template>
                <el-menu-item v-for="(third,i) in subMenu.subs" :index="third.index" :key="i">
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
            <i class="icon" :class="menu.icon"></i>
            <template #title>
              <span class="title">{{ menu.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from "vuex";

export default defineComponent({
  components: {
  },
  setup() {
    const menus = [
      {
        icon: "fas fa-chart-line fa-2x fa-fw",
        index: "/dashboard",
        title: "系统首页"
      },
      {
        icon: "fas fa-users fa-2x fa-fw",
        index: "/users",
        title: "用户管理"
      },
      {
        icon: "fas fa-file-alt fa-2x fa-fw",
        index: "/orders",
        title: "需求单管理"
      },
      {
        icon: "fas fa-wrench fa-2x fa-fw",
        index: "/products",
        title: "耗材管理"
      },
      {
        icon: "fas fa-ban fa-2x fa-fw",
        index: "/permissions",
        title: "权限管理"
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

    const store = useStore();
    const collapse = computed(() => store.state.collapse);

    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    return {
      menus,
      collapse,
      handleOpen,
      handleClose,
    }
  },
})
</script>

<style scoped>
.icon {
  margin: 12px;
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