<template>
    <div class="sidebar">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :router="true"
                unique-opened
                :default-active="onRoutes"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                background-color="#545c64"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
            >
                <!--递归路由对象-->
                <sidebar-item
                    v-for="route in routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script setup>
import path from 'path/posix'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { isExternal } from '../../../utils/validate'
import sidebarItem from './SidebarItem.vue'
const route = useRoute()
const store = useStore()
const isCollapse = computed(() => store.getters.collapse)

const routes = computed(() => store.getters.routes)

const onRoutes = computed(() => {
    return route.path;
})

const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
        return routePath
    }
}

</script>

<style scoped>
.sidebar {
    position: absolute;
    top: 80px;
    left: -10px;
    overflow-y: auto;
    height: 100%;
    /* 导致突然跳起 */
    /* z-index: 10000; */
}
:deep().el-scrollbar__view,
:deep()ul {
    min-width: 100px;
    min-height: 100%;
    background-color: #545c64;
}

:deep().el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
}

</style>


