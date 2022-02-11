<template>
    <div>
        <div class="user-header">
            <div>
                <el-row>
                    <el-col :span="12" class="search">
                        <el-autocomplete
                            v-model="searchKeyword"
                            value-key="name"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            class="inline-input"
                            placeholder="名称"
                            @select="handleSelect"
                        />
                    </el-col>
                    <el-button :icon="Search" type="primary" @click="handleSearchList">搜索</el-button>
                </el-row>
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
                <el-table-column prop="name" label="名称" width="180" />
                <el-table-column label="头像" width="180">
                    <template v-slot="scope">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="scope.row.avatar"
                            :initial-index="1"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" width="180" />
                <el-table-column prop="emailVerifiedAt" label="激活时间" width="180" sortable>
                    <template v-slot="scope">
                        <p v-if="scope.row.emailVerifiedAt == null">未激活</p>
                        <p v-else>{{ scope.row.emailVerifiedAt }}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="createdAt" label="创建时间" sortable />
                <el-table-column prop="enable" label=" 状态/是否启用/冻结" width="180">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.enable" @change="handleEnable(scope.row)" />
                    </template>
                </el-table-column>
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
                >></el-pagination>
            </div>
        </div>
    </div>
    <div class="dialog">
        <el-dialog v-model="dialogFormVisible" title="编辑">
            <el-form :model="defaultForm">
                <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input
                        v-model="defaultForm.name"
                        autocomplete="off"
                        type="productName"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="头像" :label-width="formLabelWidth">
                    <el-upload
                        class="avatar-uploader"
                        action="http://upload.qiniup.com"
                        :data="qiniuUploadData"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :on-progress="handleProgress"
                        :on-error="handleError"
                        disabled
                    >
                        <img v-if="defaultForm.avatar" :src="defaultForm.avatar" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input
                        v-model="defaultForm.email"
                        type="textarea"
                        autocomplete="off"
                        disabled
                    ></el-input>
                </el-form-item>
                <el-form-item label="激活时间" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.emailVerifiedAt" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="是否启用" :label-width="formLabelWidth">
                    <el-switch v-model="defaultForm.enable" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleEnable(defaultForm)">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search, Download, CirclePlus, Plus } from '@element-plus/icons';
import { listUserAPI, deleteUserAPI, updateUserAPI } from '@/api/user'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'
import {
    UploadFile,
    ElUploadProgressEvent,
    ElFile,
} from 'element-plus/es/components/upload/src/upload.type'
import router from "../../router";

const defaultList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword: null
})

const querySearchList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword: null
})

const defaultFormTemp = ref({
    name: '',
    avatar: '',
    email: '',
    email_verified_at: '',
    enable: ''
})

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const searchKeyword = ref(null)
const pageTotal = ref(null)
const dialogFormVisible = ref(false)

let multipleSelection = []
const multipleTable = ref()
const tableData = ref([])

const getList = () => {
    listUserAPI(defaultList.value).then(res => {
        tableData.value = res.data.records
        pageTotal.value = res.data.total
    }).catch(err => tableData(err))
}

const handleAvatarSuccess = (res, file) => {
    defaultForm.value.avatar = 'http://' + qiniuDomain + '/' + res.key;
    alert('success');
}
const beforeAvatarUpload = (file) => {
    qiniuUploadData.value.key = file.name
    const isJPG = file.type === 'image/jpeg'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
        ElMessage.error('Avatar picture must be JPG format!')
    }
    if (!isLt2M) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
    }
    return isJPG && isLt2M
}

const handleUpdate = (row) => {
    dialogFormVisible.value = true
    defaultForm.value = row
}
const updateData = () => {
    updateUserAPI(defaultForm.value).then(res => {
        getList()
    }).catch(err => tableData(err))
    dialogFormVisible.value = false
}
const handleEnable = (row) => {
    defaultForm.value = row
    updateData()
}

const handleDelete = (row) => {
    deleteUserAPI(row).then(res => {
        getList()
    }).catch(err => tableData(err))
}

const handleSearchList = () => {
    defaultList.value.pageNum = 1
    defaultList.value.keyword = searchKeyword
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
    listUserAPI(querySearchList.value).then(res => {
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
            list.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
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
        const tHeader = ['名称', '邮箱', '激活时间', '创建时间']
        const filterVal = ['name', 'email', 'emailVerifiedAt', 'createdAt']
        const list = tableData.value
        console.log(list)
        const data = formatJson(filterVal, list)
        console.log(data)
        excel.export_json_to_excel({
            header: tHeader, //表头 必填
            data, //具体数据 必填
            filename: '用户列表', //非必填
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
    let url = listAllUserURL()
    window.open(url)
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