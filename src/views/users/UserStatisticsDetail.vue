<template>
  <div>
    <div class="user-header">
      <div>
        <el-col :span="16" class="userName">
          <el-button disabled>
            用户名：
            <span class="userDetailName">{{ userDetailName }}</span>
          </el-button>
        </el-col>
        <!-- 可以换成el-select -->

        <el-select
          v-model="radio"
          class="m-2"
          placeholder="选择时间段(默认全部)"
          size="large"
          @change="changeRadio"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-date-picker
          v-if="radio == 3"
          v-model="timePickerValue"
          type="daterange"
          unlink-panels
          range-separator="To"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
          @change="changeTimePicker(timePickerValue)"
        ></el-date-picker>

        <!-- <el-radio-group v-model="radio" @change="changeRadio(radio)">
                    <el-radio :label="1" border>本月</el-radio>
                    <el-radio :label="2" border>本年</el-radio>
                    <el-radio :label="3" border>
                        <span>指定时间</span>
                        <el-date-picker
                            v-model="timePickerValue"
                            type="daterange"
                            unlink-panels
                            range-separator="To"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :shortcuts="shortcuts"
                            @change="changeTimePicker(timePickerValue)"
                        ></el-date-picker>
                    </el-radio>
                </el-radio-group> -->
        <el-button
          :icon="Search"
          type="primary"
          @click="handleSearchList"
          class="button-search"
          >搜索</el-button
        >
      </div>
      <div class="button-right">
        <el-dropdown trigger="click">
          <el-button :icon="Grid" type="primary" class="button-data-type"
            >数据类型</el-button
          >
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="echartsVisible = 2" divided
                >显示数据为柱状图</el-dropdown-item
              >
              <el-dropdown-item @click="echartsVisible = 3"
                >显示数据为折线图</el-dropdown-item
              >
              <el-dropdown-item @click="echartsVisible = 4"
                >显示数据为饼图</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-dropdown trigger="click">
          <el-button :icon="Download" type="primary">导出</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDowloadPage"
                >导出当前页为excel</el-dropdown-item
              >
              <el-dropdown-item>导出当前页为pdf</el-dropdown-item>
              <el-dropdown-item divided>导出已选为excel</el-dropdown-item>
              <el-dropdown-item>导出已选为pdf</el-dropdown-item>
              <el-dropdown-item divided @click="handleDowloadAllURL"
                >导出全部为excel</el-dropdown-item
              >
              <el-dropdown-item>导出全部为pdf</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="default-info">
      <div class="default-info-table">
        <el-col>
          <div class="table-cell-title">
            <el-row class="table-cell-title-detail">订单总数</el-row>
            <el-row class="table-cell-title-detail">已领用耗材总数</el-row>
            <el-row class="table-cell-title-detail">最多已领用耗材型号</el-row>
          </div>
        </el-col>
        <el-col>
          <div class="table-cell">
            <el-row class="table-cell-detail">{{ countOrderNumber }}</el-row>
            <el-row class="table-cell-detail">{{ sumProductNumber }}</el-row>
            <el-row class="table-cell-detail">{{ maxNumSkuName }}</el-row>
          </div>
        </el-col>
      </div>
      <div class="charts">
        <el-card class="echarts" v-if="echartsVisible == 2" shadow="hover">
          <div class="stock-info">
            <span>柱状图</span>
            <hr />
            <div class="chart">
              <Bar
                v-if="chartsReset"
                :xAxisData="xAxisData"
                :yAxisData="yAxisData"
                :selection="selection"
              />
            </div>
          </div>
        </el-card>
        <el-card class="echarts" v-if="echartsVisible == 3" shadow="hover">
          <div class="month-info">
            <span>折线图</span>
            <hr />
            <div class="chart">
              <Line
                v-if="chartsReset"
                :xAxisData="xAxisData"
                :yAxisData="yAxisData"
                :selection="selection"
              />
            </div>
          </div>
        </el-card>
        <el-card class="echarts" v-if="echartsVisible == 4" shadow="hover">
          <div class="year-info">
            <span>饼图</span>
            <hr />
            <div class="chart">
              <Pie
                v-if="chartsReset"
                :xAxisData="xAxisData"
                :yAxisData="yAxisData"
                :selection="selection"
              />
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div>
      <div>
        <el-table
          :data="tableData"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="orderSn" label="订单号" width="180" />
          <el-table-column prop="user" label="使用人" />
          <el-table-column prop="orderStatus" label="订单状态" />
          <el-table-column prop="orderRemarks" label="订单留言" />
          <el-table-column prop="createdAt" label="创建时间" />
          <el-table-column fixed="right" label="操作" width="120">
            <template v-slot="scope">
              <el-button
                type="text"
                size="small"
                @click="handleDetail(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="user-footer">
        <div>
          <el-button @click="toggleSelection()">清除已选</el-button>
        </div>
        <div class="pagination">
          <el-pagination
            v-model:currentPage="defaultList.pageNum"
            :page-sizes="[5, 10, 15]"
            :page-size="defaultList.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageTotal"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            >></el-pagination
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Bar from "../../components/Charts/Bar.vue";
import Pie from "../../components/Charts/Pie.vue";
import Line from "../../components/Charts/Line.vue";
import { ref, onMounted, nextTick, computed } from "vue";
import { Search, Download, CirclePlus, Plus, Grid } from "@element-plus/icons";
// import { listUserAPI, deleteUserAPI, updateUserAPI } from '@/api/user'
import { listAllUserStatisticsURL } from "@/api/excel";
import {
  listUserDateOrderCountAPI,
  listUserDateOrderAPI,
  listUserDateOrderNoGroupAPI,
  listUserDateOrderAllListAPI,
  listUserOrderAPI,
  updateUserOrderAPI,
  listUserDateOrderAllListDayAPI,
  listUserDateOrderAllListMonthAPI,
} from "@/api/user-order";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
import {
  UploadFile,
  ElUploadProgressEvent,
  ElFile,
} from "element-plus/es/components/upload/src/upload.type";
import router from "../../router";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import store from "../../store";
import moment from "moment";
import storage from "../../utils/storage";
import { watch } from "vue";
const userDetailName = computed(() => {
  if (store.getters.userDetailName != "") {
    return store.getters.userDetailName;
  } else {
    return storage.get("USER_DETAIL_NAME");
  }
});
const route = useRoute();

const timePickerValue = ref();

const xAxisData = ref([]);
const yAxisData = ref([]);
const selection = ref("订单总数");

const setXAxisData = () => {
  xAxisData.value = [];
  for (let i = 0; i < tableDataAllList.value.length; i++) {
    xAxisData.value[i] = tableDataAllList.value[i].timeUnit;
  }
};

const setYAxisData = (selection) => {
  yAxisData.value = [];
  if (selection == "订单总数") {
    for (let i = 0; i < tableDataAllList.value.length; i++) {
      yAxisData.value[i] = tableDataAllList.value[i].countOrderNumber;
    }
  } else if (selection == "耗材数量") {
    for (let i = 0; i < tableDataAllList.value.length; i++) {
      yAxisData.value[i] = tableDataAllList.value[i].sumProductNumber;
    }
  }
};

// const radio = ref(storage.get("USER_RADIO"));
const radio = ref();
const startTime = ref();
const endTime = ref();
const timeFrame = ref();

const currentMonth = () => {
  const startTime = moment().startOf("month").format("YYYY-MM-DD");
  const endTime = moment().endOf("month").format("YYYY-MM-DD");
  const timeFrames = startTime + "——" + endTime;
  if (tableData.value != null) {
    for (let i = 0; i < tableData.value.length; i++) {
      tableData.value[i].timeFrame = timeFrames;
    }
  }
};
const currentYear = () => {
  const startTime = moment().startOf("year").format("YYYY-MM-DD");
  const endTime = moment().endOf("year").format("YYYY-MM-DD");
  const timeFrames = startTime + "——" + endTime;
  if (tableData.value != null) {
    for (let i = 0; i < tableData.value.length; i++) {
      tableData.value[i].timeFrame = timeFrames;
    }
  }
};
const changeRadio = (radio) => {
  console.log("radio:", radio);
  if (radio == 1) {
    defaultList.value.dateState = 1;
    defaultList.value.specifiedTime1 = "";
    defaultList.value.specifiedTime2 = "";
    timePickerValue.value = null;
  } else if (radio == 2) {
    defaultList.value.dateState = 2;
    defaultList.value.specifiedTime1 = "";
    defaultList.value.specifiedTime2 = "";
    timePickerValue.value = null;
  } else if (radio == 3) {
    defaultList.value.dateState = 3;
  } else {
    defaultList.value.dateState = 4;
    defaultList.value.specifiedTime1 = "";
    defaultList.value.specifiedTime2 = "";
    timePickerValue.value = null;
  }
};
const changeTimePicker = (timePickerValue) => {
  defaultList.value.specifiedTime1 = timePickerValue[0];
  defaultList.value.specifiedTime2 = timePickerValue[1];
};

const shortcuts = [
  {
    text: "近一周",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "近一个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: "近三个月",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];

const options = [
  {
    value: "1",
    label: "本月",
  },
  {
    value: "2",
    label: "本年",
  },
  {
    value: "3",
    label: "指定时间",
  },
  {
    value: "4",
    label: "全部时间",
  },
];

const defaultList = ref({
  pageNum: 1,
  pageSize: 5,
  userId: null,
  receiver: storage.get("USER_DETAIL_NAME"),
  dateState: storage.get("USER_DATE_STATE"),
  specifiedTime1: storage.get("USER_SPECIFIED_TIME1"),
  specifiedTime2: storage.get("USER_SPECIFIED_TIME2"),
});

const querySearchList = ref({
  pageNum: 1,
  pageSize: 5,
  receiver: null,
});

const defaultFormTemp = ref({
  name: "",
  avatar: "",
  email: "",
  email_verified_at: "",
  enable: "",
});

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const searchKeyword = ref(null);
const pageTotal = ref(null);

const dialogFormVisible = ref(false);
const echartsVisible = ref(2);

let multipleSelection = [];
const multipleTable = ref();
const tableData = ref([]);
const tableDataAllList = ref([]);
const countOrderNumber = ref("");
const sumProductNumber = ref("");
const maxNumSkuName = ref("");

const handleDetail = (row) => {};
const status = {
  1: "审核中",
  2: "已到货",
  3: "已收货",
  4: "已结束(评价)",
  0: "已驳回",
  "-1": "已取消",
};
const changeStatus = (i, index) => {
  tableData.value[index].orderStatus = status[i];
};

const getList = () => {
  if (defaultList.value.dateState == 2) {
    listUserDateOrderAPI(defaultList.value)
      .then((res) => {
        tableData.value = res.data.records;
        pageTotal.value = res.data.total;
        currentYear();
        for (let i = 0; i < tableData.value.length; i++) {
          changeStatus(tableData.value[i].orderStatus, i);
        }
      })
      .catch(console.log("false"));
  } else if (defaultList.value.dateState == 3) {
    if (
      defaultList.value.specifiedTime1 != "" &&
      defaultList.value.specifiedTime2 != ""
    ) {
      listUserDateOrderAPI(defaultList.value)
        .then((res) => {
          tableData.value = res.data.records;
          const timeFrames =
            defaultList.value.specifiedTime1 +
            "----" +
            defaultList.value.specifiedTime2;
          if (tableData.value != null) {
            for (let i = 0; i < tableData.value.length; i++) {
              tableData.value[i].timeFrame = timeFrames;
            }
          }
          pageTotal.value = res.data.total;
          for (let i = 0; i < tableData.value.length; i++) {
            changeStatus(tableData.value[i].orderStatus, i);
          }
        })
        .catch(console.log("false"));
    } else {
      ElMessage.error("请选择开始时间与结束时间");
    }
  } else if (defaultList.value.dateState == 1) {
    listUserDateOrderAPI(defaultList.value)
      .then((res) => {
        tableData.value = res.data.records;
        pageTotal.value = res.data.total;
        currentMonth();
        console.log("defaulttttttttttttttt:", defaultList.value);
        console.log("tableDataaaaaaaaaaaaaaaaaa", tableData.value);
        for (let i = 0; i < tableData.value.length; i++) {
          changeStatus(tableData.value[i].orderStatus, i);
        }
      })
      .catch(console.log("false"));
  } else {
    listUserDateOrderAPI(defaultList.value)
      .then((res) => {
        tableData.value = res.data.records;
        pageTotal.value = res.data.total;
        console.log("tableData.value", tableData.value);
        for (let i = 0; i < tableData.value.length; i++) {
          changeStatus(tableData.value[i].orderStatus, i);
        }
      })
      .catch(console.log("false"));
  }
};
watch(userDetailName, () => {
  defaultList.value.receiver = storage.get("USER_DETAIL_NAME");
  defaultList.value.dateState = storage.get("USER_DATE_STATE");
  defaultList.value.specifiedTime1 = storage.get("USER_SPECIFIED_TIME1");
  defaultList.value.specifiedTime2 = storage.get("USER_SPECIFIED_TIME2");
  //   radio.value = storage.get("USER_RADIO");
  getList();
  getAllList();
});
const chartsReset = ref(true);

const getAllList = () => {
  chartsReset.value = false;
  nextTick(() => {
    setTimeout(() => {
      chartsReset.value = true;
    }, 500);
  });
  if (defaultList.value.dateState == 2) {
    listUserDateOrderAllListMonthAPI(defaultList.value).then((res) => {
      tableDataAllList.value = res.data;
      valueUserDefaultInfo(tableDataAllList.value);
      setXAxisData();
      setYAxisData(selection.value);
    });
  } else if (defaultList.value.dateState == 3) {
    listUserDateOrderAllListDayAPI(defaultList.value).then((res) => {
      tableDataAllList.value = res.data;
      valueUserDefaultInfo(tableDataAllList.value);
      setXAxisData();
      setYAxisData(selection.value);
    });
  } else if (defaultList.value.dateState == 1) {
    listUserDateOrderAllListDayAPI(defaultList.value).then((res) => {
      tableDataAllList.value = res.data;
      valueUserDefaultInfo(tableDataAllList.value);
      setXAxisData();
      setYAxisData(selection.value);
      console.log("tableDataAllListtttttttttt:", tableDataAllList.value);
    });
  } else {
    listUserDateOrderAllListDayAPI(defaultList.value).then((res) => {
      console.log("defaultList.value:", defaultList.value);
      tableDataAllList.value = res.data;
      valueUserDefaultInfo(tableDataAllList.value);
      setXAxisData();
      setYAxisData(selection.value);
      console.log("tableDataAllListtttttttttt:", tableDataAllList.value);
    });
  }
};
const valueUserDefaultInfo = (data) => {
  countOrderNumber.value = 0;
  sumProductNumber.value = 0;
  for (let i = 0; i < data.length; i++) {
    countOrderNumber.value += data[i].countOrderNumber;
    maxNumSkuName.value = data[0].maxNumSkuName;
    sumProductNumber.value += data[i].sumProductNumber;
  }
};

const handleSearchList = () => {
  defaultList.value.pageNum = 1;
  getList();
  getAllList();
};

const handleSizeChange = (val) => {
  defaultList.value.pageNum = 1;
  defaultList.value.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  defaultList.value.pageNum = val;
  getList();
};

const querySearch = (queryString, cb) => {
  let lists = [];
  querySearchList.value.pageSize = pageTotal.value;
  listUserDateOrderAPI(querySearchList.value).then((res) => {
    for (let i = 0; i < res.data.records.length; i++) {
      lists[i] = res.data.records[i];
    }
    const results = queryString
      ? lists.filter(createFilter(queryString))
      : lists;
    cb(results);
  });
};

const createFilter = (queryString) => {
  return (list) => {
    return list.receiver.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item) => {
  console.log(item);
};

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTable.value.toggleRowSelection(row);
    });
  } else {
    multipleTable.value.clearSelection();
  }
};

const handleSelectionChange = (val) => {
  multipleSelection = val;
};

//excel fontEnd
const handleDowloadPage = () => {
  import("@/utils/Export2Excel").then((excel) => {
    const tHeader = ["订单号", "使用人", "订单状态", "订单留言", "创建时间"];
    const filterVal = [
      "orderSn",
      "user",
      "orderStatus",
      "orderRemarks",
      "createdAt",
    ];
    const list = tableData.value;
    const data = formatJson(filterVal, list);
    excel.export_json_to_excel({
      header: tHeader, //表头 必填
      data, //具体数据 必填
      filename: "用户统计", //非必填
      autoWidth: true, //非必填
      bookType: "xlsx", //非必填
    });
  });
};
const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j];
    })
  );
};

//excel backEnd
const handleDowloadAllURL = () => {
  let url = listAllUserStatisticsURL();
  window.open(url);
};

getList();
getAllList();
</script>
<style scoped>
.table-cell-title {
  height: 100%;
  position: relative;
  display: grid;
  grid-template-rows: 33% 33% auto;
}
.table-cell {
  height: 100%;
  position: relative;
  display: grid;
  grid-template-rows: 33% 33% auto;
}
.table-cell-detail {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  /* text-align: center; */
  align-content: center;
  justify-content: center;
  font-size: 20px;
  color: #606266;
  text-align: center;
  overflow: auto;
}

.table-cell-title-detail {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  background: #f2f6fc;
  align-content: center;
  justify-content: center;
  font-size: 16px;
  color: #303133;
  overflow: auto;
}
.default-info-table {
  background-color: white;
  display: grid;
  grid-template-columns: 50% auto;
  position: relative;
  margin-right: 10px;
}
.default-info {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 20% auto;
}
:deep().el-autocomplete.inline-input {
  margin-right: 20px !important;
}
.el-radio {
  margin-right: 20px !important;
}
.button-search {
  height: 0px;
  margin-left: 20px;
}
button.el-button.el-button--primary.button-data-type.el-dropdown-selfdefine {
  margin-right: 5px;
}
/* .button-data-type{
    margin-right: 5px;
} */
.user-footer,
.user-header,
.userName {
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}
.userDetailName {
  color: black;
}

:deep()
  .el-date-editor.el-range-editor.el-input__inner.el-date-editor--daterange {
  height: 38px;
  margin-left: 5px;
}

:deep().el-row {
  display: flex;
  justify-items: flex-start;
}

.el-radio-group {
  margin-left: 10px;
}

:deep()label.el-radio.is-bordered {
  background-color: white;
}
.el-pagination {
  --el-pagination-button-height: 40px;
}
.el-input--mini .el-input__inner {
  height: 40px;
}
:deep().avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
:deep().avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d !important;
  width: 120px;
  height: 120px;
  text-align: center !important;
  line-height: 120px;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
:deep().el-form-item__label {
  display: grid;
  grid-template-columns: 100px;
}
:deep().el-textarea__inner,
:deep().el-input__inner {
  max-width: 500px !important;
}
:deep().el-dialog {
  width: 800px;
  height: 530px;
}
:deep().el-dialog__footer,
:deep().el-dialog__body {
  background-color: white;
}
:deep().el-table__row .el-input__inner {
  transition: background-color 0.25s ease;
  transition-property: backgraound border;
  transition-duration: 0.25s 0.25s;
  transition-timing-function: ease ease;
  background-color: white;
  border: white;
}

:deep().el-table__row:hover .el-input__inner {
  transition: background-color 0.25s ease;
  transition-property: backgraound border;
  transition-duration: 0.25s 0.25s;
  transition-timing-function: ease ease;
  border: #f5f7fa;
  background-color: #f5f7fa;
}

.tableproductName :deep()span.el-input__suffix {
  margin-right: 45px;
}
</style>