<template>
    <div>
        <div class="user-header">
            <div>
                <el-row>
                    <el-col :span="12" class="search">
                        <el-autocomplete
                            v-model="searchKeyword"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            class="inline-input"
                            placeholder="名称/角色"
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
                <el-table-column prop="name" label="管理员名称" width="180" />
                <el-table-column label="图片" width="180">
                    <template v-slot="scope">
                        <el-image
                            style="width: 100px; height: 100px"
                            :src="scope.row.avatar"
                            :initial-index="1"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="role" label="管理员角色" width="180" />
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
                >></el-pagination>
            </div>
        </div>
    </div>
    <div class="dialog">
        <el-dialog v-model="dialogFormVisible" title="新增管理员">
            <el-form :model="defaultForm">
                <el-form-item label="管理员名称" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.password" autocomplete="off" type="password"></el-input>
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
                    >
                        <img v-if="defaultForm.avatar" :src="defaultForm.avatar" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="管理员角色" :label-width="formLabelWidth">
                    <el-select
                        v-model="options.name"
                        class="m-2"
                        placeholder="请选择角色"
                        size="large"
                        @change="roleChange"
                    >
                        <el-option v-for="item in options" :key="item.id" :value="item.name"></el-option>
                    </el-select>
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
import { listAdminAPI, createAdminAPI, deleteAdminAPI, updateAdminAPI } from '@/api/admin-user'
import { listRoleAPI as getRole } from "../../api/admin-role"
import { getToken } from "../../api/upload-pic"
import { ElMessage } from 'element-plus'
import {
    UploadFile,
    ElUploadProgressEvent,
    ElFile,
} from 'element-plus/es/components/upload/src/upload.type'

const currentPage1 = ref(5)
const qiniuDomain = 'r6ctg8uno.hd-bkt.clouddn.com';
const qiniuUploadData = ref({
    token: "",
    key: ""
})

const defaultList = ref({
    pageNum: 1,
    pageSize: 5,
    keyword: null
})

const searchKeyword = ref(null)
const pageTotal = ref(null)
const dialogFormVisible = ref(false)
const dialogStatus = ref('')

let multipleSelection = []
const multipleTable = ref()
const restaurants = ref([])
const state2 = ref()
const urls = ref([])
const srcList = ref([])
const tableData = ref([])
const options = ref([])

const defaultForm = ref({
    name: '',
    password: '',
    avatar: '',
    roleId: ''
})

getToken().then(res => {
    qiniuUploadData.value.token = res.data.token
})

const handleCreate = () => {
    restForm()
    options.value.name = ''
    dialogFormVisible.value = true
}
const createData = () => {
    createAdminAPI(defaultForm.value).then(res => {
    })
    dialogFormVisible.value = false
}

const restForm = () => {
    defaultForm.value.name = ''
    defaultForm.value.password = ''
    defaultForm.value.avatar = ''
    defaultForm.value.roleId = ''
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

const getList = () => {
    listAdminAPI(defaultList.value).then(res => {
        tableData.value = res.data.records
        pageTotal.value = res.data.total;

    }).catch(err => console.log(err))
}

getList()
getRole().then(res => {
    options.value = res.data.records
}).catch(err => console.log(err))

const roleChange = () => {
    for (let i = 0; i < options.value.length; i++) {
        if (options.value.name == options.value[i].name) {
            defaultForm.value.roleId = options.value[i].id
            break
        }
    }
}
const handleUpdate = (row) => {
    dialogStatus.value = "update"
    dialogFormVisible.value = true
    defaultForm.value = row
    options.value.name = row.role
    roleChange()
}
const updateData = () => {
    updateAdminAPI(defaultForm.value).then(res => {
        getList()
    }).catch(err => console.log(err))
    dialogFormVisible.value = false
    dialogStatus == ''
}

const handleDelete = (row) => {
    deleteAdminAPI(row).then(res => {
        getList()
    }).catch(err => console.log(err))
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
    const results = queryString
        ? restaurants.value.filter(createFilter(queryString))
        : restaurants.value
    // call callback function to return suggestions
    cb(results)
}
const createFilter = (queryString) => {
    return (restaurant) => {
        return (
            restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
            0
        )
    }
}
const loadAll = () => {
    return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' },
    ]
}
const handleSelect = (item) => {
    console.log(item)
}
onMounted(() => {
    restaurants.value = loadAll()
})

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
:deep().el-dialog__body {
    max-width: 500px !important;
}
:deep().el-dialog {
    width: 800px;
    height: 530px;
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