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
        <div class="title">耗材管理系统</div>
        <div class="header-right">
            <div>
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
                <img src="../assets/logo.png" />
            </div>
            <!-- 头像下拉 -->
            <el-dropdown class="user-name" trigger="click">
                <span class="el-dropdown-link">
                    admin
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item disabled>Action 4</el-dropdown-item>
                        <el-dropdown-item divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { ArrowDown, BellFilled, Expand, Fold } from '@element-plus/icons';
import { computed } from '@vue/reactivity';
import { useStore } from 'vuex';
const store = useStore();
const collapse = computed(() => store.getters.collapse);
const collapseChage = () => {
    store.commit("HANDLE_COLLAPSE", !collapse.value);
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
    font-size: 30px;
    text-align: left;
    margin-left: 20px;
    margin-top: 18px;
    color: white;
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