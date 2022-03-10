<template>
    <div class="layout">
        <v-header />
        <div class="layout-center">
            <v-sidebar />
            <div class="content-box" :class="{ 'content-collapse': collapse }">
                <v-tags></v-tags>
                <div class="content">
                    <router-view v-slot="{ Component }">
                        <transition name="move" mode="out-in">
                            <div>
                                <keep-alive>
                                    <component :is="Component" />
                                </keep-alive>
                            </div>
                        </transition>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
// import vSidebar from "./Sidebar.vue";
import vSidebar from "./Sidebar/index.vue"
import vHeader from "./Header.vue";
import vTags from "./Tags.vue";
import { useStore } from "vuex";
import { computed } from 'vue';
// import { markRaw } from "vue";
// export default {
//     components: {
//         vSidebar: markRaw(vSidebar),
//         vHeader: markRaw(vHeader),
//         vTags: markRaw(vTags)
//     },
//     setup() {
const store = useStore();
const collapse = computed(() => store.getters.collapse);
//         return {
//             store,
//             collapse
//         }
//     },
// }

</script>
