<script>
export default {
    name:"Bar"
}
</script>>

<script setup>
import echarts from "@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core"

let echartInstance;

function initechartInstance() {
    const echartDom = document.querySelector(".bar");
    if (!echartDom) return;
    echartInstance = echarts.init(echartDom);
    echartInstance.clear();

    echartInstance.setOption({
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow"
            }
        },
        grid: {
            bottom: "20%",
            height: "68%",
            containLabel: true
        },
        xAxis: [
            {
                type: "category",
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    interval: 0
                    // width: "70",
                    // overflow: "truncate"
                },
                data: ["open_issues", "forks", "watchers", "star"]
            }
        ],
        yAxis: [
            {
                type: "value"
            }
        ],
        series: [
            {
                name: "GitHub信息",
                type: "bar",
                data: [3, 204, 1079, 1079]
            }
        ]
    });
}

onBeforeMount(() => {
    nextTick(() => {
        initechartInstance();
    });
});

onMounted(() => {
    nextTick(() => {
        useEventListener("resize", () => {
            if (!echartInstance) return;
            useTimeoutFn(() => {
                echartInstance.resize();
            }, 180);
        });
    });
});

tryOnUnmounted(() => {
    if (!echartInstance) return;
    echartInstance.dispose();
    echartInstance = null;
})

</script>

<template>
    <div class="bar"></div>
</template>

<style scoped>
.bar{
    width: 100%;
    height: 35vh;
}
</style>