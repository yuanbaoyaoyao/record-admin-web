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
            <div class="output">
                <el-dropdown trigger="click">
                    <el-button type="primary">导出</el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>导出当前页为excel</el-dropdown-item>
                            <el-dropdown-item>导出当前页为pdf</el-dropdown-item>
                            <el-dropdown-item divided>导出已选为excel</el-dropdown-item>
                            <el-dropdown-item>导出已选为pdf</el-dropdown-item>
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
                <el-table-column prop="number" label="需求单号" width="180" />
                <el-table-column prop="name" label="姓名" width="180" />
                <el-table-column prop="date" label="申请时间" sortable width="180" />
                <el-table-column prop="state" label="状态" />
                <el-table-column fixed="right" label="操作" width="120">
                    <template #default>
                        <el-button type="text" size="small">详情</el-button>
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
                    v-model:currentPage="currentPage4"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="100"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search } from '@element-plus/icons';
const multipleTable = ref();
const restaurants = ref([])
const state2 = ref();
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

const tableData = [
    {
        number:"23423423423",
        date: '2016-05-03',
        name: 'Tom',
        state:'已收货',
    },
    {
        number:"23423423423",
        date: '2016-05-02',
        name: 'Tom',
        state:'未处理',
    },
    {
        number:"23423423423",
        date: '2016-05-04',
        name: 'Tom',
        state:'已收货',
    },
    {
        number:"23423423423",
        date: '2016-05-01',
        name: 'Tom',
        state:'未处理',
    },
]
let multipleSelection = []
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
.el-pagination{
    --el-pagination-button-height: 40px;
}
.el-input--mini .el-input__inner{
    height: 40px;
}
</style>