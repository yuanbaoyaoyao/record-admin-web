<template>
    <div>
        <div>
            <div class="content">
                <router-view v-slot="{Component}">
                    <transition>
                        <keep-alive>
                            <component :is="Component"/>
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>