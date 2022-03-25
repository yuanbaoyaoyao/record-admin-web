<template>
    <div v-if="showTags" class="tags">
        <div class="tags-list">
            <el-tabs
                :model-value="$route.path"
                type="border-card"
                @tab-click="handleClick"
                @tab-remove="handleRemove"
                closable
            >
                <el-tab-pane
                    class="tab"
                    v-for="item in editableTabs"
                    :key="item.path"
                    :label="item.title"
                    :name="item.path"
                ></el-tab-pane>
            </el-tabs>
        </div>

        <div class="tags-management">
            <el-dropdown @command="handleCloseTags" trigger="click">
                <el-button type="primary">
                    标签选项
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>

                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script setup>
import { computed } from '@vue/reactivity';
import { useStore } from "vuex"
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons';
import { onMounted } from '@vue/runtime-core';
import path from 'path/posix';
const route = useRoute();
const router = useRouter();

const store = useStore();
const editableTabs = computed(() => store.getters.editableTabs);
const showTags = computed(() => editableTabs.value.length > 0);

const addTags = (route) => {
    console.log("editableTabs.value", editableTabs.value)
    const isExist = editableTabs.value.some((menu) => {
        return menu.path === route.fullPath;
    })

    if (!isExist) {
        store.commit("HANDLE_ADD_TAGS", {
            name: route.name,
            title: route.meta.title,
            path: route.fullPath
        })
    }
}

const handleClick = (tab) => {
    //将当前tab名字与store中的edableTabs中的名字比对，获得路由
    for (var i = 0; i < editableTabs.value.length; i++) {
        if (editableTabs.value[i].title === tab.props.label) {
            router.push(editableTabs.value[i].path)
            break;
        }
    }
}

const handleRemove = (path) => {
    var tabIndex, delItem;
    for (var i = 0; i < editableTabs.value.length; i++) {
        if (editableTabs.value[i].path === path) {
            delItem = editableTabs.value[i];
            tabIndex = i;
            store.commit("HANDLE_DELETE_TAGS", { i });
            break;
        }
    }
    const item = editableTabs.value[tabIndex]
        ? editableTabs.value[tabIndex]
        : editableTabs.value[tabIndex - 1];
    if (item) {
        delItem.path === route.fullPath && router.push(item.path);
    } else {
        router.push("/");
    }

}

const closeAll = () => {
    store.commit("HANDLE_CLEAR_TAGS");
    router.push("/")
}

const closeOthers = () => {
    const curItem = editableTabs.value.filter((item) => {
        return item.path === route.fullPath;
    });
    store.commit("HANDLE_DELETE_OTHER_TAGS", curItem);
};

const handleCloseTags = (command) => {
    command === "other" ? closeOthers() : closeAll()
}
// addTags(route)

</script>

<style>
.tags {
    display: flex;
    justify-content: space-between;
    /* box-shadow: 2px 0px 0px #dad4d4; */
}
.tags-list {
    height: auto;
    overflow: hidden;
    background: #fff;
}
.tags-management {
    float: right;
}
.el-tabs--border-card > .el-tabs__content {
    padding: 0px !important;
}
</style>
