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
                <el-table-column prop="name" label="角色名称" width="180" />
                <el-table-column prop="description" label="描述" width="180" />
                <el-table-column prop="createdAt" label="创建时间" sortable />
                <el-table-column fixed="right" label="操作" width="120">
                    <template v-slot="scope">
                        <el-button type="text" size="small">分配资源</el-button>
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
        <el-dialog v-model="dialogFormVisible" :title="textMap[dialogStatus]">
            <el-form :model="defaultForm">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="defaultForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
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
import { listRoleAPI, createRoleAPI, deleteRoleAPI, updateRoleAPI } from '@/api/admin-role'

let multipleSelection = []
const multipleTable = ref();
const tableData = ref([])
const pageTotal = ref(null)
const dialogFormVisible = ref(false)
const dialogStatus = ref('')
const searchKeyword = ref(null)
const textMap = {
    update: '编辑',
    create: '创建'
}

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
    name: '',
    description: '',
})

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const getList = () => {
    listRoleAPI(defaultList.value).then(res => {
        tableData.value = res.data.records
        pageTotal.value = res.data.total
    }).catch(err => console.log(err))
}

const handleCreate = () => {
    dialogStatus.value = "create"
    restForm()
    dialogFormVisible.value = true
}

const createData = () => {
    createRoleAPI(defaultForm.value).then(res => {
    })
    dialogFormVisible.value = false
}

const handleUpdate = (row) => {
    dialogStatus.value = "update"
    dialogFormVisible.value = true
    defaultForm.value = row
}

const updateData = () => {
    updateRoleAPI(defaultForm.value).then(res => {
        getList()
    }).catch(err => tableData(err))
    dialogFormVisible.value = false
    dialogStatus == ''
}

const handleDelete = (row) => {
    deleteRoleAPI(row).then(res => {
        getList()
    }).catch(err => tableData(err))
}

const restForm = () => {
    defaultForm.value = Object.assign({}, defaultFormTemp.value)
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
    listRoleAPI(querySearchList.value).then(res => {
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
:deep().el-textarea__inner,
:deep().el-input__inner {
    max-width: 500px !important;
}
:deep().el-dialog__footer,
:deep().el-dialog__body {
    background-color: white;
}
:deep().el-dialog {
    width: 800px;
    height: 330px;
}
</style>