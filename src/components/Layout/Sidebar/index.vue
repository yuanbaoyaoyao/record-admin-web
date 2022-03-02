<template>
    <!-- <div :class="{ 'has-logo': showLogo }"> -->
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <div class="sidebar">
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                :router="true"
                :unique-opened="false"
                :default-active="onRoutes"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                background-color="#545c64"
                text-color="#fff"
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
    <!-- </div> -->
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { isExternal } from '../../../utils/validate'
// import logo form './Logo.vue'
import sidebarItem from './SidebarItem.vue'

const route = useRoute()
const store = useStore()
const isCollapse = computed(() => store.getters.collapse)
// const showLogo = computed(() => store.state.settingsModule.sideBarLogo)
const routes = computed(() => store.getters.routes)
console.log("routes.value1:", routes.value)
// const activeMenu = computed(() => store.getters['tabModule/getCurrentIndex'])
const onRoutes = computed(() => {
    return route.path;
})

onMounted(() => {
    const routePath = route.path
    // store.commit('tabModule/SET_TAB', routePath)
})

const resolvePath = (routePath) => {
    if (isExternal(routePath)) {
        return routePath
    }
}

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
    /* 导致突然跳起 */
    /* z-index: 10000; */
}
:deep().el-scrollbar__view,
:deep()ul {
    min-width: 100px;
    min-height: 100%;
    background-color: #545c64;
}
ul {
    border-color: #545c64;
}
</style>


