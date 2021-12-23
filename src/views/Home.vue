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
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import vSidebar from "../components/Sidebar.vue";
import vHeader from "../components/Header.vue";
import vTags from "../components/Tags.vue";
import { useStore } from "vuex";
import { computed } from 'vue';
const store = useStore();
const collapse = computed(() => store.state.collapse);

</script>
