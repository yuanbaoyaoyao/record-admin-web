<script setup>
import echarts from "@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, onUnmounted,ref } from "vue";
import { useEventListener, tryOnUnmounted, useTimeoutFn } from "@vueuse/core";

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
    default: () => "",
  },
});
console.log("xAxisData:", props.xAxisData)
console.log("yAxisData:", props.yAxisData)
console.log("selection:", props.selection)

let echartInstance;
const isShowEcharts = ref(true);

function initechartInstance() {
  const echartDom = document.querySelector(".line");
  if (!echartDom) return;
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    dataZoom: [
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "filter",
      },
    ],
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          name: "折线图",
          excludeComponents: ["toolbox"],
          pixelRatio: 2,
          title: "下载",
        },
      },
    },
    grid: {
      bottom: "20%",
      height: "68%",
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      type: "category",
      axisLabel: {
        interval: 0,
      },
      data: props.xAxisData,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: props.selection,
        data: props.yAxisData,
        type: "line",
        areaStyle: {},
      },
    ],
  });
}

onBeforeMount(() => {
  nextTick(() => {
    initechartInstance();
  });
});

onUnmounted(() => {
  isShowEcharts.value = false;
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
});
</script>

<template >
  <div v-if="props.xAxisData.length != 0 && isShowEcharts" class="line"></div>
  <div v-else>暂无数据</div>
</template>

<style scoped>
.line {
  width: 100%;
  height: 35vh;
}
</style>
