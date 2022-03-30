<template>
    <div>
        <div class="user-header">
            <div>
                <el-col :span="12" class="search">
                    <el-autocomplete
                        v-model="searchKeyword"
                        value-key="receiver"
                        :fetch-suggestions="querySearch"
                        :trigger-on-focus="false"
                        class="inline-input"
                        placeholder="名称"
                        @select="handleSelect"
                    />
                </el-col>
                <!-- 可以换成el-select -->
                <el-radio-group v-model="radio" @change="changeRadio(radio)">
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
                </el-radio-group>
                <el-button
                    :icon="Search"
                    type="primary"
                    @click="handleSearchList"
                    class="button-search"
                >搜索</el-button>
            </div>
            <div class="button-right">
                <el-dropdown trigger="click">
                    <el-button :icon="Download" type="primary">导出</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleDowloadPage">导出当前页为excel</el-dropdown-item>
                            <el-dropdown-item>导出当前页为pdf</el-dropdown-item>
                            <el-dropdown-item divided>导出已选为excel</el-dropdown-item>
                            <el-dropdown-item>导出已选为pdf</el-dropdown-item>
                            <el-dropdown-item divided @click="handleDowloadAllURL">导出全部为excel</el-dropdown-item>
                            <el-dropdown-item>导出全部为pdf</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div>
            <el-table
                ref="multipleTable"
                :data="tableData"
                :default-sort="{ prop: 'date', order: 'descending' }"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="orderSn" label="需求单号" width="180" />
                <el-table-column prop="receiver" label="申请人" width="180" />
                <el-table-column prop="user" label="使用人" width="180" />
                <el-table-column prop="orderRemarks" label="订单留言" width="180" />
                <!-- <el-table-column prop="productNumber" label="耗材数量" width="180" /> -->
                <el-table-column prop="createdAt" label="创建时间" sortable />
                <el-table-column prop="orderStatus" label="状态" width="180" sortable />
                <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click="handleDetail(scope.$index, scope.row)"
                        >详情</el-button>
                        <!-- <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button> -->
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
                >></el-pagination>
            </div>
        </div>
    </div>
    <!-- <el-dialog v-model="dialogFormVisible" title="查看订单详情">
        <el-descriptions class="margin-top" :column="3" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <user />
                        </el-icon>耗材类别
                    </div>
                </template>
                {{ tableDetail.productTitle }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <iphone />
                        </el-icon>耗材型号
                    </div>
                </template>
                {{ tableDetail.productSkusTitle }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <location />
                        </el-icon>耗材数量
                    </div>
                </template>
                {{ tableDetail.productNumber }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <tickets />
                        </el-icon>订单状态
                    </div>
                </template>
                <el-tag size="small">{{ tableDetail.orderStatus }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>订单号
                    </div>
                </template>
                {{ tableDetail.orderSn }}
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" :column="3" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>申请人
                    </div>
                </template>
                {{ tableDetail.receiver }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>使用人
                    </div>
                </template>
                {{ tableDetail.user }}
            </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="margin-top" :column="3" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>地址
                    </div>
                </template>
                {{ tableDetail.userAddressId }}
            </el-descriptions-item>
        </el-descriptions>

        <el-descriptions class="margin-top" :column="3" :size="size" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        <el-icon :style="iconStyle">
                            <office-building />
                        </el-icon>备注
                    </div>
                </template>
                {{ tableDetail.orderRemarks }}
            </el-descriptions-item>
        </el-descriptions>

        <template #footer>
            <span class="dialog-footer">
                <template v-if="tableDetail && tableDetail.orderStatus == '审核中'">
                    <el-button type="danger" @click="updateDataReject(tableDetail)">驳回需求</el-button>
                </template>
                <el-button type="info" @click="dialogFormVisible = false">取消</el-button>
                <template v-if="tableDetail && tableDetail.orderStatus == '审核中'">
                    <el-button type="primary" @click="updateDataArrivals(tableDetail)">到货通知</el-button>
                </template>
            </span>
        </template>
    </el-dialog>-->
</template>
<script setup>
import { ref, onMounted, reactive, computed } from "vue"
import { Search, Download, CirclePlus, Plus } from '@element-plus/icons'
import {
    User,
    Iphone,
    Location,
    Tickets,
    OfficeBuilding,
} from '@element-plus/icons-vue'
import { listProductSkusAPI, createProductSkusAPI, deleteProductSkusAPI, updateProductSkusAPI } from '@/api/product-skus'
import { listProductAPI as getProduct } from "../../api/product"
import { listAllProductSkusURL } from "../../api/excel"
import { listUserOrderAPI, updateUserOrderAPI,listUserDateOrderNoGroupAPI  } from "../../api/user-order"
import { getToken } from "../../api/upload-pic"
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import {
    UploadFile,
    ElUploadProgressEvent,
    ElFile,
} from 'element-plus/es/components/upload/src/upload.type'
import router from "../../router";
import { getUserInfo } from "../../api/login"
import store from "../../store";
import moment from 'moment'

const tableDetail = ref()

const size = ref('')
const iconStyle = computed(() => {
    const marginMap = {
        large: '8px',
        default: '6px',
        small: '4px',
    }
    return {
        marginRight: marginMap[size.value] || marginMap.default,
    }
})
const blockMargin = computed(() => {
    const marginMap = {
        large: '32px',
        default: '28px',
        small: '24px',
    }
    return {
        marginTop: marginMap[size.value] || marginMap.default,
    }
})

const radio = ref(1)

const changeRadio = (radio) => {
    console.log("radio:", radio)
    if (radio == 1) {
        defaultList.value.dateState = 1
        defaultList.value.specifiedTime1 = ''
        defaultList.value.specifiedTime2 = ''
        timePickerValue.value = null
    } else if (radio == 2) {
        defaultList.value.dateState = 2
        defaultList.value.specifiedTime1 = ''
        defaultList.value.specifiedTime2 = ''
        timePickerValue.value = null
    } else {
        defaultList.value.dateState = 3
    }

}
const changeTimePicker = (timePickerValue) => {
    defaultList.value.specifiedTime1 = timePickerValue[0]
    defaultList.value.specifiedTime2 = timePickerValue[1]
}

const shortcuts = [
    {
        text: '近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
        },
    },
    {
        text: '近一个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
        },
    },
    {
        text: '近三个月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
        },
    },
]


const defaultList = ref({
    pageNum: 1,
    pageSize: 5,
    userId: null,
    receiver: null,
    dateState: 1,
    specifiedTime1: '',
    specifiedTime2: '',
})

const querySearchList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword1: null
})

const defaultFormTemp = {
    receiver: '',
    user: '',
    productTitle: '',
    productSkusTitle: '',
    productNumber: '',
    orderSn: '',
    orderStatus: null,
}
const defaultForm = ref(Object.assign({}, defaultFormTemp))
const textMap = {
    update: '编辑',
    create: '创建'
}

const status = {
    "1": "审核中",
    "2": "已到货",
    "3": "已收货",
    "4": "已结束(评价)",
    "0": "已驳回",
    "-1": "已取消",
}

const changeStatus = (i, index) => {
    tableData.value[index].orderStatus = status[i]
}

const searchKeyword = ref(null)
const pageTotal = ref(null)
const dialogFormVisible = ref(false)
const dialogStatus = ref('')

// let multipleSelection = []
const multipleTable = ref()
const tableData = ref([])
const addressInfo = ref([])
const options = ref([])

// const updateDataReject = (tableDetail) => {

//     //添加handleconfirm
//     ElMessageBox.confirm(
//         console.log("tableDetail1", tableDetail),
//         '是否确认驳回需求',
//         {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: 'warning',
//         },
//     ).then(() => {
//         let tableDetailTemp = Object.assign({}, tableDetail);
//         defaultForm.value = tableDetailTemp
//         defaultForm.value.orderStatus = 0
//         updateUserOrderAPI(defaultForm.value).then(res => {
//             ElMessage({
//                 type: 'success',
//                 message: '驳回成功',
//             })
//             dialogFormVisible.value = false
//             defaultForm.value = Object.assign({}, defaultFormTemp)
//             getList()
//         })
//     })
//         .catch(() => {
//             ElMessage({
//                 type: 'info',
//                 message: '取消驳回',
//             })
//         })
// }

// const updateDataArrivals = (tableDetail) => {

//     //添加handleconfirm
//     ElMessageBox.confirm(
//         console.log("tableDetail1", tableDetail),
//         '是否确认到货',
//         {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             type: 'warning',
//         },
//     ).then(() => {
//         let tableDetailTemp = Object.assign({}, tableDetail);
//         defaultForm.value = tableDetailTemp
//         defaultForm.value.orderStatus = 2
//         updateUserOrderAPI(defaultForm.value).then(res => {
//             ElMessage({
//                 type: 'success',
//                 message: '确认到货成功',
//             })
//             dialogFormVisible.value = false
//             defaultForm.value = Object.assign({}, defaultFormTemp)
//             getList()
//         })

//     })
//         .catch(() => {
//             ElMessage({
//                 type: 'info',
//                 message: '取消确认到货',
//             })
//         })
// }

const getList = () => {
    if (defaultList.value.dateState == 2) {
        listUserDateOrderNoGroupAPI(defaultList.value).then(res => {
            tableData.value = res.data.records
            pageTotal.value = res.data.total
        }).catch(console.log("false"))

    } else if (defaultList.value.dateState == 3) {
        if (defaultList.value.specifiedTime1 != '' && defaultList.value.specifiedTime2 != '') {
            listUserDateOrderNoGroupAPI(defaultList.value).then(res => {
                tableData.value = res.data.records
                const timeFrames = (defaultList.value.specifiedTime1 + '----' + defaultList.value.specifiedTime2)
                if (tableData.value != null) {
                    for (let i = 0; i < tableData.value.length; i++) {
                        tableData.value[i].timeFrame = timeFrames
                    }
                }
                pageTotal.value = res.data.total
            }).catch(console.log("false"))
        } else {
            ElMessage.error('请选择开始时间与结束时间')
        }
    }
    else {
        listUserDateOrderNoGroupAPI(defaultList.value).then(res => {
            tableData.value = res.data.records
            pageTotal.value = res.data.total
            console.log("tableData",tableData.value)
        }).catch(console.log("false"))
    }
}

const productChange = () => {
    for (let i = 0; i < options.value.length; i++) {
        if (options.value.title == options.value[i].title) {
            defaultForm.value.productId = options.value[i].id
            break
        }
    }
}
const handleDetail = (index, row) => {
    console.log("row", row)
    tableDetail.value = row
    store.commit("SET_ORDER_SN", row.orderSn)
    router.push("/orderDetail")
    // dialogFormVisible.value = true
}

const handleSearchList = () => {
    defaultList.value.pageNum = 1
    defaultList.value.receiver = searchKeyword
    getList()
}

const handleSizeChange = (val) => {
    defaultList.value.pageNum = 1
    defaultList.value.pageSize = val
    getList()
}

const handleCurrentChange = (val) => {
    defaultList.value.pageNum = val
    console.log("valllllllllllllllll:", val)
    getList()
}

const querySearch = (queryString, cb) => {
    let lists = []
    querySearchList.value.pageSize = pageTotal.value
    listProductSkusAPI(querySearchList.value).then(res => {
        for (let i = 0; i < res.data.records.length; i++) {
            lists[i] = res.data.records[i]
        }
        const results = queryString ? lists.filter(createFilter(queryString)) : lists
        cb(results)
    })
}

const createFilter = (queryString) => {
    return (list) => {
        return (
            list.receiver.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

const handleSelect = (item) => {
    console.log(item)
}

const toggleSelection = (rows) => {
    if (rows) {
        rows.forEach((row) => {
            multipleTable.value.toggleRowSelection(row)
        })
    } else {
        multipleTable.value.clearSelection()
    }
}

const handleSelectionChange = (val) => {
    multipleSelection = val
}

//excel fontEnd
const handleDowloadPage = () => {
    import('@/utils/Export2Excel').then(excel => {
        const tHeader = ['需求单号', '申请人', '使用人', '订单留言', '创建时间', '状态']
        const filterVal = ['orderSn', 'receiver', 'user', 'orderRemarks', 'createdAt', 'orderStatus']
        const list = tableData.value
        console.log(list)
        const data = formatJson(filterVal, list)
        console.log(data)
        excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: '需求列表', //非必填
            autoWidth: true, //非必填
            bookType: 'xlsx' //非必填
        })
    })
}
const formatJson = (filterVal, jsonData) => {
    return jsonData.map(v => filterVal.map(j => {
        return v[j]
    }))
}

//excel backEnd
const handleDowloadAllURL = () => {
    let url = listAllProductSkusURL()
    window.open(url)
}

getList()
// getToken().then(res => {
//     qiniuUploadData.value.token = res.data.token
// })

// getProduct().then(res => {
//     options.value = res.data.records
// }).catch(err => tableData(err))
</script>
<style scoped>
.user-footer,
.user-header,
.search {
    display: flex;
    justify-content: space-between;
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
:deep()td.el-descriptions__cell.el-descriptions__label.is-bordered-label.is-left {
    width: 150px !important;
}
</style>