<script setup>
import echarts from "@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core"

const props = defineProps({
    xAxisData: {
        type: Array,
        default: () => [],
    },
    yAxisData: {
        type: Array,
        default: () => [],
    },
    selection: {
        type: String,
        default: () => '',
    },
})
console.log("xAxisData:", props.xAxisData)
console.log("yAxisData:", props.yAxisData)
console.log("selection:", props.selection)

let echartInstance;

function initechartInstance() {
    const echartDom = document.querySelector(".bar");
    if (!echartDom) return;
    echartInstance = echarts.init(echartDom);
    echartInstance.clear();

    echartInstance.setOption({
        dataZoom: [{
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        }],
        toolbox: {
            show: true,
            feature: {
                saveAsImage: {
                    show: true,
                    name: "柱状图",
                    excludeComponents: ['toolbox'],
                    pixelRatio: 2,
                    title: '下载'
                }
            }
        },
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
                data: props.xAxisData,

            }
        ],
        yAxis: [
            {
                type: "value",
                minInterval: 1
            }
        ],
        series: [
            {
                name: props.selection,
                type: "bar",
                data: props.yAxisData
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
.bar {
    width: 100%;
    height: 35vh;
}
</style>