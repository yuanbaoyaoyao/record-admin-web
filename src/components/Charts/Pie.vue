<script setup>
import echarts from "@/plugins/echarts";
import { onBeforeMount, onMounted, nextTick, onUnmounted, ref } from "vue";
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
const pieData = ref([]);
// console.log("xAxisData:", props.xAxisData);
// console.log("yAxisData:", props.yAxisData);
// console.log("length:", props.xAxisData.length);
// console.log("selection:", props.selection);

for (let i = 0; i < props.xAxisData.length; i++) {
  let name = props.xAxisData[i];
  let value = props.yAxisData[i];
  pieData.value[i] = { value, name };
}
console.log("pieData:", pieData.value);

let echartInstance;
const isShowEcharts = ref(true);

function initechartInstance() {
  const echartDom = document.querySelector(".pie");
  if (!echartDom) return;
  echartInstance = echarts.init(echartDom);
  echartInstance.clear(); //清除旧画布 重新渲染

  echartInstance.setOption({
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: true,
          name: "饼图",
          excludeComponents: ["toolbox"],
          pixelRatio: 2,
          title: "下载",
        },
      },
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      right: true,
    },
    series: [
      {
        name: props.selection,
        type: "pie",
        radius: "60%",
        center: ["40%", "50%"],
        data: pieData.value,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
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
  <div v-if="props.xAxisData.length != 0 && isShowEcharts" class="pie"></div>
  <div v-else>暂无数据</div>
</template>

<style scoped>
.pie {
  width: 100%;
  height: 35vh;
}
</style>
