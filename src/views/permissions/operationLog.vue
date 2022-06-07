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
              placeholder="管理员名称"
              @select="handleSelect"
            />
          </el-col>
          <el-button :icon="Search" type="primary" @click="handleSearchList"
            >搜索</el-button
          >
        </el-row>
      </div>
      <div class="button-right">
        <el-dropdown trigger="click">
          <el-button :icon="Download" type="primary">导出</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleDowloadPage"
                >导出当前页为excel</el-dropdown-item
              >
              <el-dropdown-item>导出当前页为pdf</el-dropdown-item>
              <el-dropdown-item divided>导出已选为excel</el-dropdown-item>
              <el-dropdown-item>导出已选为pdf</el-dropdown-item>
              <el-dropdown-item divided @click="handleDowloadAllURL"
                >导出全部为excel</el-dropdown-item
              >
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
        <el-table-column prop="adminUserName" label="管理员名称" width="180" />
        <el-table-column prop="ip" label="ip" width="180" />
        <el-table-column prop="menu" label="操作菜单" width="180" />
        <el-table-column prop="action" label="操作行为" width="180" />
        <el-table-column prop="result" label="操作结果" width="180" />
        <el-table-column prop="createdAt" label="创建时间" sortable />
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
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search, Download, CirclePlus, Plus } from "@element-plus/icons";
import { listOperationLogAPI } from "../../api/admin-operation-log";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
import {
  UploadFile,
  ElUploadProgressEvent,
  ElFile,
} from "element-plus/es/components/upload/src/upload.type";
import router from "../../router";

const defaultList = ref({
  pageNum: 1,
  pageSize: 5,
  keyword: null,
});

const querySearchList = ref({
  pageNum: 1,
  pageSize: 5,
  keyword: null,
});

const defaultFormTemp = ref({
  adminUserName: "",
  ip: "",
  menu: "",
  action: "",
  result: "",
});

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const searchKeyword = ref(null);
const pageTotal = ref(null);
const dialogFormVisible = ref(false);

let multipleSelection = [];
const multipleTable = ref();
const tableData = ref([]);

const getList = () => {
  listOperationLogAPI(defaultList.value)
    .then((res) => {
      tableData.value = res.data.records;
      pageTotal.value = res.data.total;
    })
    .catch((err) => tableData(err));
};


const handleSearchList = () => {
  defaultList.value.pageNum = 1;
  defaultList.value.keyword = searchKeyword;
  getList();
};

const handleSizeChange = (val) => {
  defaultList.value.pageNum = 1;
  defaultList.value.pageSize = val;
  getList();
};

const handleCurrentChange = (val) => {
  defaultList.value.pageNum = val;
  getList();
};

const querySearch = (queryString, cb) => {
  let lists = [];
  querySearchList.value.pageSize = pageTotal.value;
  listOperationLogAPI(querySearchList.value).then((res) => {
    for (let i = 0; i < res.data.records.length; i++) {
      lists[i] = res.data.records[i];
    }
    const results = queryString
      ? lists.filter(createFilter(queryString))
      : lists;
    console.log("results", results);
    cb(results);
  });
};

const createFilter = (queryString) => {
  return (list) => {
    return list.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};

const handleSelect = (item) => {
  console.log(item);
};

const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTable.value.toggleRowSelection(row);
    });
  } else {
    multipleTable.value.clearSelection();
  }
};

const handleSelectionChange = (val) => {
  multipleSelection = val;
};

//excel frontEnd
const handleDowloadPage = () => {
  import("@/utils/Export2Excel").then((excel) => {
    const tHeader = ["管理员名称", "ip", "操作菜单", "操作行为","操作结果","创建时间"];
    const filterVal = ["adminUserName","ip", "menu", "action","result", "createdAt"];
    const list = tableData.value;
    console.log(list);
    const data = formatJson(filterVal, list);
    console.log(data);
    excel.export_json_to_excel({
      header: tHeader, //表头 必填
      data, //具体数据 必填
      filename: "管理员日志", //非必填
      autoWidth: true, //非必填
      bookType: "xlsx", //非必填
    });
  });
};
const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) =>
    filterVal.map((j) => {
      return v[j];
    })
  );
};

//excel backEnd
// const handleDowloadAllURL = () => {
//   let url = listAllUserURL();
//   window.open(url);
// };

getList();
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