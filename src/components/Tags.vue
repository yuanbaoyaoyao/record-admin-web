<template>
    <div v-if="showTags">
        <div class="tags">
            <el-tabs
                :model-value="$route.meta.title"
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
                    :name="item.title"
                ></el-tab-pane>
            </el-tabs>
        </div>

        <div class="dropdown">
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
<script lang="ts">
import { computed } from '@vue/reactivity';
import { useStore } from "vuex"
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { ArrowDown } from '@element-plus/icons';
export default {
    components: {
        ArrowDown
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const store = useStore();
        const editableTabs = computed(() => store.state.editableTabs);
        const showTags = computed(() => editableTabs.value.length > 0);

        const addTags = (route) => {
            const isExist = editableTabs.value.some((menu) => {
                return menu.path === route.fullPath;
            })
            if (!isExist) {
                store.commit("handleAddTags", {
                    name: route.name,
                    title: route.meta.title,
                    path: route.fullPath
                })
            }
        }

        const handleClick = (tab) => {
            //将当前tab名字与store中的edableTabs中的名字比对，获得路由
            for (var i = 0; i < editableTabs.value.length; i++) {
                if (editableTabs.value[i].title === tab.props.name) {
                    router.push(editableTabs.value[i].path)
                    break;
                }
            }
        }

        const handleRemove = (name) => {
            var tabIndex, delItem;
            for (var i = 0; i < editableTabs.value.length; i++) {
                if (editableTabs.value[i].title === name) {
                    delItem = editableTabs.value[i];
                    tabIndex = i;
                    store.commit("handleDeleteTags", { i });
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
            store.commit("handleClearTags");
            router.push("/")
        }

        const closeOthers = () => {
            const curItem = editableTabs.value.filter((item) => {
                return item.path === route.fullPath;
            });
            store.commit("handleDeleteOtherTags", curItem);
        };

        const handleCloseTags = (command) => {
            command === "other" ? closeOthers() : closeAll()
        }
        addTags(route)

        onBeforeRouteUpdate((to) => {
            addTags(to)
        })
        return {
            editableTabs,
            showTags,
            handleClick,
            handleRemove,
            handleCloseTags
        }
    },
}
</script>

<style>
.tags {
    position: relative;
    height: 41px;
    overflow: hidden;
    background: #fff;
    padding-right: 120px;
    margin-top: 0px;
    width: 100%;
    z-index: 100;
}
.dropdown {
    position: relative;
    bottom: 40px;
    float: right;
    z-index: 1000;
}
</style>
