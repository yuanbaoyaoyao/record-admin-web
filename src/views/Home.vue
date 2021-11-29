<template>
    <div>
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags></v-tags>
            <div class="content">
                <router-view v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive>
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>
<script>
import vSidebar from "../components/Sidebar.vue";
import vHeader from "../components/Header.vue";
import vTags from "../components/Tags.vue";
import { useStore } from "vuex";
import { computed } from 'vue';
export default {
    components: {
        vSidebar,
        vHeader,
        vTags
    },
    setup() {
        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        return {
            collapse,
        }
    }
}
</script>
