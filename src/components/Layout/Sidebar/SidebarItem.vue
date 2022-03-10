<template>
    <div v-if="item.meta.title != '登录'" class="sidebar-item">
        <template v-if="hasOneShowingChild(item.children, item)">
            <el-menu-item
                :key="onlyOneChild.path"
                :index="onlyOneChild.path"
                :route="onlyOneChild.path"
            >
                <div>
                    <i class="icon" :class="onlyOneChild.meta.icon"></i>
                </div>
                <template #title>
                    <span class="title">{{ onlyOneChild.meta.title }}</span>
                </template>
            </el-menu-item>
        </template>
        <el-sub-menu v-else ref="subMenu" :index="item.path" popper-append-to-body>
            <template #title>
                <div>
                    <i class="icon" :data-index="item.path" :class="item.meta.icon"></i>
                </div>
                <span v-if="!collapse" class="title">{{ item.meta.title }}</span>
            </template>

            <sidebar-item
                v-for="child in item.children"
                :key="child.path"
                :is-nest="true"
                :item="child"
                :base-path="child.path"
                class="nest-menu"
            />
        </el-sub-menu>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { toRef } from '@vue/reactivity'
import { computed, onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'


export default defineComponent({
    name: 'SidebarItem',
    props: {
        item: {
            type: Object,
            required: true
        },
        isNested: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const onlyOneChild = ref()
        const store = useStore()
        const basePath = toRef(props, 'basePath')
        const collapse = computed(() => store.getters.collapse);
        // const lang = computed(()=>store.getters[''])
        onMounted(() => {
            // console.log('basePath.value', basePath.value)
        })
        const routes = computed(() => store.getters.routes)
        const hasOneShowingChild = (children, parent) => {
            // console.log("parent:", parent)
            // console.log("children:", children)
            if (!children) {
                onlyOneChild.value = { ...parent, noShowingChildren: true }
                return true
            }
            const showingChildren = children.filter((item) => {
                onlyOneChild.value = item
                return true
            })
            if (showingChildren.length === 1) {
                return true
            }
            // if (showingChildren.length === 0) {
            //     onlyOneChild.value = { ...parent, noShowingChildren: true }
            //     return true
            // }
            return false
        }
        return {
            onlyOneChild,
            hasOneShowingChild,
            // lang,
            collapse
        }
    },
})
</script>
<style scoped>
.title {
    font-size: 15px;
}
.icon {
    display: block;
    margin: 14px;
}
</style>