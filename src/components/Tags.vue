<template>
    <div class="tags" v-if="showTags">
        <el-tabs
            :model-value="$route.meta.title"
            type="border-card"
            @tab-click="handleClick"
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
</template>
<script lang="ts">
import { computed } from '@vue/reactivity';
import { useStore } from "vuex"
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
export default {
    setup() {
        const route = useRoute();
        const router = useRouter();

        const store = useStore();
        const editableTabs = computed(() => store.state.editableTabs);
        const showTags = computed(() => editableTabs.value.length > 0);
        // const editableTabsValue = computed(() => store.state.tabsIndex);

        const addTags = (route) => {
            const isExist = editableTabs.value.some((menu) => {
                return menu.path === route.fullPath;
            })
            if (!isExist) {
                store.commit("addTags", {
                    name: route.name,
                    title: route.meta.title,
                    path: route.fullPath
                })
            }
        }

        const handleClick = (tab) => {
            //将当前tab名字与store中的edableTabs中的名字比对，获得路由
            var length = editableTabs.value.length;
            for (var i = 0; i < length; i++) {
                if (editableTabs.value[i].title === tab.props.name) {
                    router.push(editableTabs.value[i].path)
                    break;
                }
            }
        }
        addTags(route)

        onBeforeRouteUpdate((to) => {
            addTags(to)
        })
        return {
            editableTabs,
            // editableTabsValue,
            showTags,
            handleClick
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
}
</style>
