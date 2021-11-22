<template>
    <div>
        <v-sidebar />
        <div>
            <div class="content">
                <router-view v-slot="{ Component }">
                    <transition>
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
export default {
    components: {
        vSidebar
    }
}
</script>