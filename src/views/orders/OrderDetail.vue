<template>
    <div class="orderDetail">
        <div>
            <el-steps :active="visibleButton" align-center>
                <el-step title="审核中" description="Some description" />
                <el-step title="已到货" description="Some description" />
                <el-step title="已收货" description="Some description" />
                <el-step title="已结束(评价)" description="Some description" />
            </el-steps>
        </div>
        <el-card class="content-info">
            <div class="operation-button">
                <span>当前订单状态：{{ userOrderViewInfo.orderStatus }}</span>
                <div v-if="visibleButton == 1">
                    <el-button type="primary">确认到货</el-button>
                    <el-button type="info">订单备注</el-button>
                    <el-button type="info">用户短信</el-button>
                    <el-button type="danger">驳回需求</el-button>
                </div>
                <div v-if="visibleButton != 1">
                    <el-button type="info">订单备注</el-button>
                    <el-button type="info">用户短信</el-button>
                </div>
            </div>
            <div class="content-info-detail">
                <div class="content-info-detail-part">
                    <span class="table-head">
                        <el-icon>
                            <info-filled />
                        </el-icon>基本信息
                    </span>
                    <div>
                        <el-row class="table-row">
                            <el-col class="table-title" :span="6">订单号</el-col>
                            <el-col class="table-title" :span="18">订单留言</el-col>
                        </el-row>
                        <el-row>
                            <el-col class="table-detail" :span="6">{{ userOrderViewInfo.orderSn }}</el-col>
                            <el-col
                                class="table-detail"
                                :span="18"
                            >{{ userOrderViewInfo.orderRemarks }}</el-col>
                        </el-row>
                    </div>
                </div>
                <div class="content-info-detail-part">
                    <span class="table-head">
                        <el-icon>
                            <info-filled />
                        </el-icon>领用人信息
                    </span>
                    <el-row class="table-row">
                        <el-col class="table-title" :span="6">领用人</el-col>
                        <el-col class="table-title" :span="6">使用人</el-col>
                        <el-col class="table-title" :span="12">收货地址</el-col>
                    </el-row>
                    <el-row>
                        <el-col class="table-detail" :span="6">{{ userOrderViewInfo.receiver }}</el-col>
                        <el-col class="table-detail" :span="6">{{ userOrderViewInfo.user }}</el-col>
                        <el-col
                            class="table-detail"
                            :span="12"
                        >{{ userOrderViewInfo.addressDetail }}</el-col>
                    </el-row>
                </div>
                <div class="content-info-detail-part">
                    <span class="table-head">
                        <el-icon>
                            <info-filled />
                        </el-icon>耗材信息
                    </span>
                    <el-table
                        class="table-row"
                        ref="multipleTable"
                        border
                        :data="userOrderProductInfo"
                    >
                        <el-table-column label="耗材类别">
                            <template v-slot="scope">
                                <p>{{ scope.row.productTitle }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="耗材型号">
                            <template v-slot="scope">
                                <p>{{ scope.row.productSkusTitle }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="耗材数量">
                            <template v-slot="scope">
                                <p>{{ scope.row.number }}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="content-info-detail-part">
                    <span class="table-head">
                        <el-icon>
                            <info-filled />
                        </el-icon>操作信息
                    </span>
                    <el-row class="table-row">
                        <el-col class="table-title" :span="6">操作者</el-col>
                        <el-col class="table-title" :span="6">操作时间</el-col>
                        <el-col class="table-title" :span="6">操作动作</el-col>
                        <el-col class="table-title" :span="6">备注</el-col>
                    </el-row>
                    <el-row>
                        <el-col class="table-detail" :span="6">123</el-col>
                        <el-col class="table-detail" :span="6">123</el-col>
                        <el-col class="table-detail" :span="6">123</el-col>
                        <el-col class="table-detail" :span="6">123</el-col>
                    </el-row>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref } from '@vue/reactivity'
import { watch, computed } from 'vue';
import { listUserOrderAPI } from '../../api/user-order';
import { listOrderProductAPI } from '../../api/order-product'
import storage from "../../utils/storage"
import store from '../../store';
import { InfoFilled } from '@element-plus/icons';

const visibleButton = ref("1")

const orderSn = computed(() => {
    if (store.getters.orderSn != '') {
        return store.getters.orderSn
    } else {
        return storage.get("ORDER_SN")
    }
})

const defaultList = ref({
    orderSn: storage.get("ORDER_SN")
})

const status = {
    "1": "审核中",
    "2": "已到货",
    "3": "已收货",
    "4": "已结束(评价)",
    "0": "已驳回",
    "-1": "已取消",
}
const multipleTable = ref()
const userOrderInfo = ref()
const userOrderViewInfo = ref({
    orderSn: '',
    receiver: '',
    user: '',
    addressDetail: '',
    orderStatus: '',
    orderRemarks: '',

})
const userOrderProductInfo = ref()
const userOrderProductViewInfo = ref({
    number: '',
    productTitle: '',
    productSkusTitle: '',
})

const changeStatus = (i, index) => {
    visibleButton.value = i
    userOrderInfo.value[index].orderStatus = status[i]
}

const getUserOrderInfo = () => {
    defaultList.value.orderSn = storage.get("ORDER_SN")
    listUserOrderAPI(defaultList.value).then(res => {
        userOrderInfo.value = res.data.records
        for (let i = 0; i < userOrderInfo.value.length; i++) {
            changeStatus(userOrderInfo.value[i].orderStatus, i)
        }
        userOrderViewInfo.value = userOrderInfo.value[0]
        console.log("userOrderInfo:", userOrderInfo.value)
    }).catch()
}

const getUserOrderProductInfo = () => {
    defaultList.value.orderSn = storage.get("ORDER_SN")
    listOrderProductAPI(defaultList.value).then(res => {
        userOrderProductInfo.value = res.data
        userOrderProductViewInfo.value = userOrderProductInfo.value
        console.log("userOrderProductInfo:", userOrderProductInfo.value)
    })
}

watch(orderSn, () => {
    defaultList.value.orderSn = storage.get("ORDER_SN")
    getUserOrderInfo()
    getUserOrderProductInfo()
})
getUserOrderInfo()
getUserOrderProductInfo()

</script>

<style scoped>
.content-info-detail-part {
    margin-bottom: 20px;
}
.table-head {
    font-size: larger;
}
.table-row {
    margin-top: 20px;
}
.table-title {
    border: 1px solid #dcdfe6;
    padding: 10px;
    background: #f2f6fc;
    text-align: center;
    font-size: 14px;
    color: #303133;
}
.table-detail {
    height: 60px;
    line-height: 40px;
    border: 1px solid #dcdfe6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
}
.content-info {
    width: 90%;
    margin-left: 5%;
}
/* :deep().el-card__body{
    padding: 0;
} */
.orderDetail {
    background-color: white;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
}
.operation-button {
    background-color: #f2f6fc;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 20px;
    /* margin: ; */
}
.operation-button > span {
    font-size: x-large;
}
</style>