<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse">
        <el-icon class="expand-fold-icon">
          <expand />
        </el-icon>
      </i>
      <i v-else>
        <el-icon class="expand-fold-icon">
          <fold />
        </el-icon>
      </i>
    </div>

    <div class="title">
      <a href="#">
        <img
          src="../../assets/logo_no_fonts.png"
          style="
            display: block;
            width: 90px;
            height: fit-content;
            justify-items: center;
          "
        />
      </a>
      <div class="title-info">耗材管理系统</div>
    </div>
    <div class="header-right">
      <div class="header-right-bell">
        <!-- 消息提示 -->
        <el-tooltip>
          <router-link to="/">
            <el-icon class="bell-icon">
              <bell-filled />
            </el-icon>
          </router-link>
        </el-tooltip>
      </div>
      <!-- 头像 -->
      <div class="user-avator">
        <img src="{{adminAvatar}}" />
      </div>
      <!-- 头像下拉 -->
      <el-dropdown class="user-name" trigger="click">
        <span class="el-dropdown-link">
          {{adminName}}
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided @click="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ArrowDown, BellFilled, Expand, Fold } from "@element-plus/icons";
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import storage from "../../utils/storage";
const store = useStore();
const router = useRouter();
const route = useRoute();
const collapse = computed(() => store.getters.collapse);
const collapseChage = () => {
  store.commit("HANDLE_COLLAPSE", !collapse.value);
};

const adminName = computed(() => {
  if (store.getters.adminName != "") {
    return store.getters.adminName;
  } else {
    return storage.get("ADMIN_NAME");
  }
});

const adminAvatar = computed(() => {
  if (store.getters.adminAvatar != "") {
    return store.getters.adminAvatar;
  } else {
    return storage.get("ADEMIN_AVATAR");
  }
});

const logout = () => {
  store.dispatch("LogOut").then(() => {
    store.commit("HANDLE_CLEAR_TAGS");

    router.push(`/login?redirect=${route.fullPath}`);
  });
};
</script>

<style scoped>
.expand-fold-icon {
  font-size: 30px;
  margin-top: 25px;
}
.collapse-btn {
  float: left;
  padding: 0 25px;
  cursor: pointer;
  line-height: 70px;
  color: white;
  margin-right: 10px;
}
.bell-icon {
  color: white;
  font-size: 30px;
  margin-right: 10px;
  margin-left: 20px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.title {
  display: flex;
  font-size: 30px;
  text-align: left;
  margin-left: 20px;
  margin-top: 18px;
  color: white;
}
.title-info{
    margin-left: 30px;
}
.header {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #242f42;
}
.header-right {
  float: right;
  display: flex;
  padding-right: 50px;
  margin-top: -35px;
}
.header-right-bell{
    margin-right: 10px;
}

.user-avator img {
  display: block;
  margin-right: 80px;
  width: 35px;
  height: 35px;
}
.user-name {
  margin: -70px;
  margin-right: 0px;
  margin-top: 8px;
}
</style>