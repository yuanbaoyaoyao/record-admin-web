<template>
    <div>
        <div class="user-header">
            <div>
                <el-row>
                    <el-col :span="12" class="search">
                        <el-autocomplete
                            v-model="state2"
                            :fetch-suggestions="querySearch"
                            :trigger-on-focus="false"
                            class="inline-input"
                            placeholder="Please Input"
                            @select="handleSelect"
                        />
                    </el-col>
                    <el-button :icon="Search" type="primary">搜索</el-button>
                </el-row>
            </div>
            <div class="button-right">
                <el-button :icon="CirclePlus" type="primary">添加</el-button>
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
                    <template #default>
                        <el-button type="text" size="small">编辑</el-button>
                        <el-button type="text" size="small">删除</el-button>
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
                    v-model:currentPage="listQuery.pageNum"
                    :page-sizes="[5, 10, 15]"
                    :page-size="listQuery.pageSize"
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
import { ref, onMounted, onBeforeMount, onActivated } from "vue";
import { Search, Download, CirclePlus } from '@element-plus/icons';
import { getListAPI } from '@/api/admin-user'

const currentPage1 = ref(5)

const defaultList = ref({
    pageNum: 1,
    pageSize: 5,
})

const listQuery = ref(Object.assign({}, defaultList.value))
const pageTotal = ref(null)

let multipleSelection = []
const multipleTable = ref()
const restaurants = ref([])
const state2 = ref()
const urls = ref([])
const srcList = ref([])
const tableData = ref([])


const getList = () => {
    getListAPI(listQuery.value).then(res => {
        tableData.value = res.data.records
        pageTotal.value = res.data.total
        console.log(res.data)
    }).catch(err => console.log(err))
}

getList()

const handleSizeChange = (val) => {
    listQuery.value.pageNum = 1
    listQuery.value.pageSize = val
    console.log("yes")
    getList()
}

const handleCurrentChange = (val) => {
    listQuery.value.pageNum = val
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
<style>
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
</style>