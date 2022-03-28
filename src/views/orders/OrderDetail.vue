<template>
    <div class="orderDetail">
        <div>
            <el-steps :active="2" align-center>
                <el-step title="Step 1" description="Some description" />
                <el-step title="Step 2" description="Some description" />
                <el-step title="Step 3" description="Some description" />
                <el-step title="Step 4" description="Some description" />
            </el-steps>
        </div>
        <el-card>
            <div>
                <span>当前订单状态：{{ userOrderViewInfo.orderStatus }}</span>
                <el-button>1</el-button>
                <el-button>1</el-button>
                <el-button>1</el-button>
                <el-button>1</el-button>
            </div>
            <div>
                <div>
                    <span>基本信息</span>
                    <el-row>
                        <el-col :span="4">订单号</el-col>
                        <el-col :span="12">订单留言</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">{{ userOrderViewInfo.orderSn }}</el-col>
                        <el-col :span="12">{{ userOrderViewInfo.orderRemarks }}</el-col>
                    </el-row>
                </div>
                <div>
                    <span>领用人信息</span>
                    <el-row>
                        <el-col :span="4">领用人</el-col>
                        <el-col :span="4">使用人</el-col>
                        <!-- <el-col :span="4">联系电话</el-col> -->
                        <el-col :span="4">收货地址</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">{{ userOrderViewInfo.receiver }}</el-col>
                        <el-col :span="4">{{ userOrderViewInfo.user }}</el-col>
                        <!-- <el-col :span="4">{{ userOrderViewInfo.orderSn }}</el-col> -->
                        <el-col :span="4">{{ userOrderViewInfo.addressDetail }}</el-col>
                    </el-row>
                </div>
                <div>
                    <span>耗材信息</span>
                    <el-table ref="multipleTable" :data="userOrderProductInfo">
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
                <div>
                    <span>操作信息</span>
                    <el-row>
                        <el-col :span="4">操作者</el-col>
                        <el-col :span="4">操作时间</el-col>
                        <el-col :span="4">操作细节</el-col>
                        <el-col :span="4">备注</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4">123</el-col>
                        <el-col :span="4">123</el-col>
                        <el-col :span="4">123</el-col>
                        <el-col :span="4">123</el-col>
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

<style>
.orderDetail {
    background-color: white;
        /* width: 80%; */
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
}
</style>