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
                        placeholder="姓名/类型/型号"
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
                <el-table-column prop="receiver" label="姓名" width="180" />
                <el-table-column prop="productTitle" label="耗材类别" width="180"></el-table-column>
                <el-table-column prop="productSkusTitle" label="耗材型号" width="180" />
                <el-table-column prop="number" label="数量" width="180" sortable />
                <el-table-column prop="updatedAt" label="领用时间" sortable />
                <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="handleDetail(scope.row)">查看详情</el-button>
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
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { Search, Download, CirclePlus, Plus, Grid } from '@element-plus/icons'
import { listAllUserStatisticsURL } from '@/api/excel'
import { listUserDateOrderCountAPI, listUserDateOrderAllListAPI, listUserOrderAPI, updateUserOrderAPI } from '@/api/user-order'
import { listDateOrderNoGroupAPI } from "../../api/order-product";
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import router from "../../router";
import store from "../../store";
import moment from 'moment'
import storage from "../../utils/storage";


const timePickerValue = ref()

const handleDetail = (row) => {
    store.commit("SET_ORDER_SN", row.orderSn)
    router.push({ path: '/orderDetail' })
}

const radio = ref(1)
const startTime = ref()
const endTime = ref()
const timeFrame = ref()

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
    productTitle: null,
    productSkusTitle: null,
    dateState: 1,
    specifiedTime1: '',
    specifiedTime2: '',
})

const querySearchList = ref({
    pageNum: 1,
    pageSize: 5,
    receiver: null,
    // productTitle: null,
    // productSkusTitle: null

})

const searchKeyword = ref(null)
const pageTotal = ref(null)

const dialogFormVisible = ref(false)
let multipleSelection = []
const multipleTable = ref()
const tableData = ref([])

const getList = () => {
    if (defaultList.value.dateState == 2) {
        listDateOrderNoGroupAPI(defaultList.value).then(res => {
            tableData.value = res.data.records
            pageTotal.value = res.data.total
        }).catch(console.log("false"))

    } else if (defaultList.value.dateState == 3) {
        if (defaultList.value.specifiedTime1 != '' && defaultList.value.specifiedTime2 != '') {
            listDateOrderNoGroupAPI(defaultList.value).then(res => {
                tableData.value = res.data.records
                pageTotal.value = res.data.total
            }).catch(console.log("false"))
        } else {
            ElMessage.error('请选择开始时间与结束时间')
        }
    }
    else {
        listDateOrderNoGroupAPI(defaultList.value).then(res => {
            tableData.value = res.data.records
            pageTotal.value = res.data.total
            console.log("tableData:", tableData.value)
            console.log("lenght:", res.data.records.length)
        }).catch(console.log("false"))
    }
}


const handleSearchList = () => {
    defaultList.value.pageNum = 1
    defaultList.value.receiver = searchKeyword
    defaultList.value.productTitle = searchKeyword
    defaultList.value.productSkusTitle = searchKeyword

    getList()
}

const handleSizeChange = (val) => {
    defaultList.value.pageNum = 1
    defaultList.value.pageSize = val
    getList()
}

const handleCurrentChange = (val) => {
    defaultList.value.pageNum = val
    getList()
}

const querySearch = (queryString, cb) => {
    let lists = []
    querySearchList.value.pageSize = pageTotal.value
    listUserDateOrderCountAPI(querySearchList.value).then(res => {
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
            // list.productTitle.toLowerCase().indexOf(queryString.toLowerCase()) === 0||
            // list.productSkusTitle.toLowerCase().indexOf(queryString.toLowerCase()) === 0
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
        const tHeader = ['姓名', '耗材类别', '耗材型号', '数量', '领用时间']
        const filterVal = ['receiver', 'productTitle', 'productSkusTitle', 'number', 'updatedAt']
        const list = tableData.value
        const data = formatJson(filterVal, list)
        excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: '用户足迹', //非必填
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
    let url = listAllUserStatisticsURL()
    window.open(url)
}

getList()

</script>
<style scoped>
.echarts {
    margin-top: 10px;
}
:deep().el-autocomplete.inline-input {
    margin-right: 20px !important;
}
.el-radio {
    margin-right: 20px !important;
}
.button-search {
    height: 0px;
}
button.el-button.el-button--primary.button-data-type.el-dropdown-selfdefine {
    margin-right: 5px;
}
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
</style>