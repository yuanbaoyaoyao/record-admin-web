<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div>
            <router-link to="/adminsList">
              <span>管理员信息</span>
            </router-link>
          </div>
          <hr class="hr" />
          <div class="admin-info">
            <img src="../assets/logo.jpg" class="admin-avator" />
            <div class="admin-info-cont">
              <div class="admin-info-name">{{ adminName }}</div>
              <div class="admin-info-role">{{ adminRoles }}</div>
            </div>
          </div>
          <hr />
          <div class="admin-info-list">
            <div>
              上次登录时间：
              <span>{{ adminLastLoginTime }}</span>
            </div>
            <div>
              上次登录IP：
              <span>{{ adminLastLoginIp }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <div class="orderInfo">
            <div>
              <router-link to="/ordersList">
                <span>用户需求信息</span>
              </router-link>
            </div>
          </div>
          <hr />
          <div>
            <ul class="user-info">
              <li>领用人</li>
              <li>时间</li>
              <li>订单状态</li>
            </ul>
          </div>
          <div class="user-info-list">
            <ul v-for="(item, index) in tableData.slice(0, 4)" :key="index">
              <router-link
                to="/orderDetail"
                @click="handleOrderDetail(item.orderSn)"
              >
                <li class="user-info-list-detail">
                  <span>{{ item.receiver }}</span>
                  <span>{{ item.createdAt }}</span>
                  <span>{{ item.orderStatus }}</span>
                </li>
              </router-link>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stock-info">
            <router-link to="/consumablesList">
              <span>库存信息</span>
            </router-link>
            <hr />
            <div class="chart">
              <Bar
                v-if="chartsReset"
                :xAxisData="pSSxAxisData"
                :yAxisData="pSSyAxisData"
                :selection="pSSselection"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="month-info">
            <router-link
              to="/consumableStatistics"
              @click="handleMonthOrderDetail()"
            >
              <span>本月耗材领用信息</span>
            </router-link>
            <hr />
            <div class="chart">
              <Pie
                v-if="chartsReset"
                :xAxisData="monthOrderxAxisData"
                :yAxisData="monthOrderyAxisData"
                :selection="monthOrderselection"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="year-info">
            <router-link
              to="/consumableStatistics"
              @click="handleYearOrderDetail()"
            >
              <span>本年耗材领用信息</span>
            </router-link>
            <hr />
            <div class="chart">
              <Line
                v-if="chartsReset"
                :xAxisData="yearOrderxAxisData"
                :yAxisData="yearOrderyAxisData"
                :selection="yearOrderselection"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Bar from "../components/Charts/Bar.vue";
import Pie from "../components/Charts/Pie.vue";
import Line from "../components/Charts/Line.vue";
import {
  listUserOrderAPI,
  listUserDateOrderAllListDayAPI,
  listUserDateOrderAllListMonthAPI,
} from "../api/user-order";
import { listProductSkusAPI } from "../api/product-skus";
import { listDateOrderProductCountNoGroupAllListAPI } from "../api/order-product";
import { computed, ref, nextTick } from "vue";
import store from "../store";
import storage from "../utils/storage";

const handleOrderDetail = (orderSn) => {
  store.commit("SET_ORDER_SN", orderSn);
};

const handleMonthOrderDetail = () => {
  store.commit("SET_CONSUMABLE_RADIO", monthReceiveList.value.dataStatus);
};

const handleYearOrderDetail = () => {
  store.commit("SET_CONSUMABLE_RADIO", yearReceiveList.value.dataStatus);
};

const adminName = computed(() => {
  if (store.getters.adminName != "") {
    return store.getters.adminName;
  } else {
    return storage.get("ADMIN_NAME");
  }
});
const adminRoles = computed(() => {
  if (store.getters.adminRoles != "") {
    return store.getters.adminRoles;
  } else {
    return storage.get("ADMIN_ROLES");
  }
});
const adminLastLoginIp = computed(() => {
  if (store.getters.adminLastLoginIp != "") {
    return store.getters.adminLastLoginIp;
  } else {
    return storage.get("ADMIN_LAST_LOGIN_IP");
  }
});
const adminLastLoginTime = computed(() => {
  if (store.getters.adminLastLoginTime != "") {
    return store.getters.adminLastLoginTime;
  } else {
    return storage.get("ADMIN_LAST_LOGIN_TIME");
  }
});

const status = {
  1: "审核中",
  2: "已到货",
  3: "已收货",
  4: "已结束(评价)",
  0: "已驳回",
  "-1": "已取消",
};
const pSSxAxisData = ref([]);
const pSSyAxisData = ref([]);
const pSSselection = ref("库存总数");
const monthOrderxAxisData = ref([]);
const monthOrderyAxisData = ref([]);
const monthOrderselection = ref("月领用总数");
const yearOrderxAxisData = ref([]);
const yearOrderyAxisData = ref([]);
const yearOrderselection = ref("年领用总数");
const chartsReset = ref(true);



const productSkusStockInfo = ref([]);
const monthOrderReceiveInfo = ref([]);
const yearOrderReceiveInfo = ref([]);
const tableData = ref([]);
const monthReceiveList = ref({
  dataStatus: 1,
});
const yearReceiveList = ref({
  dataStatus: 2,
});

const setPSSXAxisData = () => {
  pSSxAxisData.value = [];
  for (let i = 0; i < productSkusStockInfo.value.length; i++) {
    pSSxAxisData.value[i] = productSkusStockInfo.value[i].productName;
  }
};

const setPSSYAxisData = (pSSselection) => {
  pSSyAxisData.value = [];
  for (let i = 0; i < productSkusStockInfo.value.length; i++) {
    pSSyAxisData.value[i] = productSkusStockInfo.value[i].stock;
  }
};
const setMonthOrderXAxisData = () => {
  monthOrderxAxisData.value = [];
  for (let i = 0; i < monthOrderReceiveInfo.value.length; i++) {
    monthOrderxAxisData.value[i] =
      monthOrderReceiveInfo.value[i].productSkusTitle;
  }
};

const setMonthOrderYAxisData = (monthOrderselection) => {
  monthOrderyAxisData.value = [];
  for (let i = 0; i < monthOrderReceiveInfo.value.length; i++) {
    monthOrderyAxisData.value[i] =
      monthOrderReceiveInfo.value[i].sumProductNumber;
  }
};
const setYearOrderXAxisData = () => {
  yearOrderxAxisData.value = [];
  for (let i = 0; i < yearOrderReceiveInfo.value.length; i++) {
    yearOrderxAxisData.value[i] =
      yearOrderReceiveInfo.value[i].productSkusTitle;
  }
};

const setYearOrderYAxisData = (yearOrderselection) => {
  yearOrderyAxisData.value = [];
  for (let i = 0; i < yearOrderReceiveInfo.value.length; i++) {
    yearOrderyAxisData.value[i] =
      yearOrderReceiveInfo.value[i].sumProductNumber;
  }
};

const changeStatus = (i, index) => {
  tableData.value[index].orderStatus = status[i];
};

const getOrderList = () => {
  listUserOrderAPI().then((res) => {
    tableData.value = res.data.records;
    for (let i = 0; i < tableData.value.length; i++) {
      changeStatus(tableData.value[i].orderStatus, i);
    }
  });
};
const getProductSkusStock = () => {
  chartsReset.value = false;
  nextTick(() => {
    setTimeout(() => {
      chartsReset.value = true;
    }, 500);
  });
  listProductSkusAPI().then((res) => {
    productSkusStockInfo.value = res.data.records;
    setPSSXAxisData();
    setPSSYAxisData(pSSselection.value);
  });
};
const getMonthProductSkusReceive = () => {
  chartsReset.value = false;
  nextTick(() => {
    setTimeout(() => {
      chartsReset.value = true;
    }, 500);
  });
  listDateOrderProductCountNoGroupAllListAPI(monthReceiveList.value).then(
    (res) => {
      monthOrderReceiveInfo.value = res.data;
      setMonthOrderXAxisData();
      setMonthOrderYAxisData(monthOrderselection.value);
    }
  );
};
const getYearProductSkusReceive = () => {
  chartsReset.value = false;
  nextTick(() => {
    setTimeout(() => {
      chartsReset.value = true;
    }, 500);
  });
  listDateOrderProductCountNoGroupAllListAPI(yearReceiveList.value).then(
    (res) => {
      yearOrderReceiveInfo.value = res.data;
      setYearOrderXAxisData();
      setYearOrderYAxisData(yearOrderselection.value);
      // console.log("productSkusStockInfo:", productSkusStockInfo.value)
      console.log("yearOrderReceiveInfo:", yearOrderReceiveInfo.value);
    }
  );
};
getOrderList();
getProductSkusStock();
getMonthProductSkusReceive();
getYearProductSkusReceive();
</script>


<style scoped>
a {
  text-decoration: none;
  color: black;
}
.orderInfo {
  display: flex;
}
.admin-info {
  display: flex;
  flex-direction: row;
  margin: 10px;
}
.admin-info-cont {
  display: flex;
  flex-direction: column;
  align-self: center;
  margin: auto;
}
.admin-info-name {
  margin: auto;
  font-size: xx-large;
  font-family: Cursive;
}
.admin-info-list {
  margin-top: 12px;
}
.user-info-list-detail {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-self: center;
  text-align: center;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}
.admin-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.user-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-self: center;
  text-align: center;
  font-size: 14px;
  color: #909399;
  background: #fafafa;
}
.user-info li {
  text-align: center;
  overflow: hidden;
}
:deep()a:link {
  color: inherit;
}
</style>