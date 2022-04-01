<template>
    <div>
        <div class="user-header">
            <div>
                <el-row>
                    <el-col :span="12" class="search">
                        <el-autocomplete
                            v-model="searchKeyword"
                            value-key="title"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            class="inline-input"
                            placeholder="耗材类别"
                            @select="handleSelect"
                        />
                    </el-col>
                    <el-button :icon="Search" type="primary" @click="handleSearchList">搜索</el-button>
                </el-row>
            </div>
            <div class="button-right">
                <el-button :icon="CirclePlus" type="primary" @click="handleCreate">添加</el-button>
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
                <el-table-column prop="title" label="耗材类别" width="180" />
                <el-table-column prop="description" label="类别描述" width="180" />
                <el-table-column prop="createdAt" label="创建时间" sortable />
                <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope">
                        <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
                ></el-pagination>
            </div>
        </div>
    </div>
    <div class="dialog">
        <el-dialog v-model="dialogFormVisible" title="新增耗材类别">
            <el-form :model="defaultForm">
                <el-form-item label="耗材类别" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="类别描述" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.description" autocomplete="off" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button v-if="dialogStatus == 'update'" type="primary" @click="updateData">确定</el-button>
                    <el-button v-else type="primary" @click="createData">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search, Download, CirclePlus, Plus } from '@element-plus/icons';
import { listProductAPI, createProductAPI, deleteProductAPI, updateProductAPI } from '@/api/product'
import { ElMessage } from 'element-plus'
import {
    UploadFile,
    ElUploadProgressEvent,
    ElFile,
} from 'element-plus/es/components/upload/src/upload.type'

const defaultList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword1: null
})

const querySearchList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword1: null
})

const defaultFormTemp = ref({
    title: '',
    description: '',
})

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const searchKeyword = ref(null)
const pageTotal = ref(null)
const dialogFormVisible = ref(false)
const dialogStatus = ref('')

let multipleSelection = []
const multipleTable = ref()
const tableData = ref([])

const getList = () => {
        // console.log(defaultList.value)
    listProductAPI(defaultList.value).then(res => {
        tableData.value = res.data.records
        pageTotal.value = res.data.total
    }).catch(err => tableData(err))
}
const handleCreate = () => {
    restForm()
    dialogFormVisible.value = true
}
const createData = () => {
    createProductAPI(defaultForm.value).then(res => {
    })
    dialogFormVisible.value = false
}

const restForm = () => {
    defaultForm.value = Object.assign({}, defaultFormTemp.value)

}

const handleUpdate = (row) => {
    dialogStatus.value = "update"
    dialogFormVisible.value = true
    defaultForm.value = row
}
const updateData = () => {
    updateProductAPI(defaultForm.value).then(res => {
        getList()
    }).catch(err => tableData(err))
    dialogFormVisible.value = false
    dialogStatus == ''
}

const handleDelete = (row) => {
    deleteProductAPI(row).then(res => {
        getList()
    }).catch(err => tableData(err))
}

const handleSearchList = () => {
    defaultList.value.pageNum = 1
    defaultList.value.keyword1 = searchKeyword
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
    listProductAPI(querySearchList.value).then(res => {
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
            list.title.toLowerCase().indexOf(queryString.toLowerCase()) === 0
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
getList()
</script>
<style scoped>
.user-footer,
.user-header,
.search {
    display: flex;
    justify-content: space-between;
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
    height: 330px;
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

.tablePassword :deep()span.el-input__suffix {
    margin-right: 45px;
}
</style>