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
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="feedbackTitle" label="反馈标题" width="180" />
        <el-table-column prop="feedbackContent" label="反馈内容" width="180" />
        <el-table-column label="图片" width="180">
          <template v-slot="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.feedbackPicUrl"
              :initial-index="1"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="isRead" label="是否已读" sortable width="180" />
        <el-table-column
          prop="isFinished"
          label="当前状态"
          sortable
          width="180"
        />
        <el-table-column prop="createdAt" label="创建时间" sortable />
        <el-table-column fixed="right" label="操作" width="120">
          <template v-slot="scope">
            <el-button
              type="text"
              size="small"
              @click="handleUpdate(scope.row, scope.$index)"
              >查看详情</el-button
            >
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
        />
      </div>
    </div>
  </div>
  <div class="dialog">
    <el-dialog v-model="dialogFormVisible" title="用户反馈">
      <div>
        <el-form :model="defaultForm">
          <el-form-item label="用户名">
            <el-input
              v-model="defaultForm.username"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="反馈标题">
            <el-input
              v-model="defaultForm.feedbackTitle"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              action="http://upload.qiniup.com"
              :data="qiniuUploadData"
              disabled
            >
              <img
                v-if="defaultForm.feedbackPicUrl"
                :src="defaultForm.feedbackPicUrl"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon">
                <plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="反馈内容">
            <el-input
              v-model="defaultForm.feedbackContent"
              type="textarea"
              autocomplete="off"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <div class="feedback-content-detail">
          <div v-for="detail in feedbackDetailData" :key="detail">
            <div
              class="feedback-content-detail-user-content"
              v-if="detail.adminUserId == null"
            >
              {{ detail.content }}
            </div>
            <div class="feedback-content-detail-admin-user" v-else >
              <div class="feedback-content-detail-admin-user-content">
                {{ detail.content }}
              </div>
              <div class="feedback-content-detail-admin-user-name">
                {{ detail.adminUserName }}
              </div>
            </div>
          </div>
        </div>
        <el-form class="feedback-send-message">
          <el-input
            v-model="message"
            placeholder="请输入回复信息"
            type="textarea"
          />
          <el-button @click="handleSendMessage">发送回复</el-button>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关闭窗口</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Search, Download, CirclePlus, Plus } from "@element-plus/icons";
import { listUserAPI, deleteUserAPI, updateUserAPI } from "@/api/user";
import {
  listUserFeedbackAPI,
  updateUserFeedbackAPI,
} from "@/api/user-feedback";
import {
  listUserFeedbackDetailAPI,
  createUserFeedbackDetailAPI,
} from "@/api/user-feedback-detail";
import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";
import {
  UploadFile,
  ElUploadProgressEvent,
  ElFile,
} from "element-plus/es/components/upload/src/upload.type";
import router from "../../router";
import storage from "../../utils/storage";

const defaultList = ref({
  pageNum: 1,
  pageSize: 5,
  keyword1: null,
});

const querySearchList = ref({
  pageNum: 1,
  pageSize: 5,
  keyword1: null,
});

const defaultFormTemp = ref({
  username: "",
  feedbackPicUrl: "",
  feedbackTitle: "",
  feedbackContent: "",
});

const defaultFeedbackForm = ref({
  id: null,
  userFeedbackId: null,
  adminUserId: null,
  content: null,
});

const defaultForm = ref(Object.assign({}, defaultFormTemp.value));

const searchKeyword = ref(null);
const pageTotal = ref(null);
const dialogFormVisible = ref(false);

let multipleSelection = [];
const multipleTable = ref();
const tableData = ref([]);
const feedbackDetailData = ref();
const message = ref();

const getList = () => {
  listUserFeedbackAPI().then((res) => {
    for (let data of res.data.records) {
      if (data.isRead == false) {
        data.isRead = "未读";
      } else {
        data.isRead = "已读";
      }
      if (data.isFinished == false) {
        data.isFinished = "进行中";
      } else {
        data.isFinished = "已结束";
      }
    }
    tableData.value = res.data.records;
    pageTotal.value = res.data.total;
  });
};

const handleUpdate = (row, index) => {
  defaultFeedbackForm.value.id = row.id;
  defaultFeedbackForm.value.userFeedbackId = row.id;
  updateUserFeedbackAPI(defaultFeedbackForm.value).then((res) => {
    row.isRead = "已读";
    tableData.value[index] = row;
  });
  listUserFeedbackDetailAPI(defaultFeedbackForm.value).then((res) => {
    feedbackDetailData.value = res.data;
  });
  dialogFormVisible.value = true;
  defaultForm.value = row;
};

const handleSendMessage = () => {
  defaultFeedbackForm.value.adminUserId = storage.get("ADMIN_USERID");
  defaultFeedbackForm.value.content = message.value;
  createUserFeedbackDetailAPI(defaultFeedbackForm.value).then((res) => {
    console.log("createUserFeedbackDetailAPI:", res);
  });
};

const handleSearchList = () => {
  defaultList.value.pageNum = 1;
  defaultList.value.keyword1 = searchKeyword;
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
  listUserFeedbackAPI(querySearchList.value).then((res) => {
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

//excel fontEnd
const handleDowloadPage = () => {
  import("@/utils/Export2Excel").then((excel) => {
    const tHeader = ["名称", "邮箱", "激活时间", "创建时间"];
    const filterVal = ["name", "email", "emailVerifiedAt", "createdAt"];
    const list = tableData.value;
    console.log(list);
    const data = formatJson(filterVal, list);
    console.log(data);
    excel.export_json_to_excel({
      header: tHeader, //表头 必填
      data, //具体数据 必填
      filename: "用户列表", //非必填
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
const handleDowloadAllURL = () => {
  let url = listAllUserURL();
  window.open(url);
};

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
  width: 1300px;
  height: 530px;
}
:deep().el-dialog__body {
  background-color: white;
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 20px;
}
:deep().el-dialog__footer {
  float: right;
}
:deep().el-dialog__footer button {
  width: 120px;
}

:deep().el-table__row .el-input__inner {
  transition: background-color 0.25s ease;
  transition-property: backgraound border;
  transition-duration: 0.25s 0.25s;
  transition-timing-function: ease ease;
  background-color: white;
  border: white;
}
.feedback-content-detail {
  border: 5px solid red;
  height: 260px;
  margin-bottom: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
}
.feedback-send-message {
  display: flex;
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
.feedback-content-detail-user-content,
.feedback-content-detail-admin-user-content {
  border: 1px solid #333;
  border-radius: 10px;
  padding: 10px;
  width: fit-content;
}
.feedback-content-detail-admin-user{
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  /* float: right; */
}
.feedback-content-detail-admin-user-name {
  padding: 10px;
  padding-top: 15px;
  width: 30px;
}
.feedback-content-detail-user-content::before {
  position: absolute;
  left: 645px;
  content: "";
  border-width: 10px;
  border-style: solid;
  border-top-color: transparent;
  border-right-color: black;
  border-bottom-color: transparent;
  border-left-color: transparent;
}
.feedback-content-detail-user-content::after {
  position: absolute;
  left: 645px;
  content: "";
  border-width: 10px;
  border-style: solid;
  border-top-color: transparent;
  border-right-color: rgb(152, 152, 150);
  border-bottom-color: transparent;
  border-left-color: transparent;
}

.feedback-content-detail-admin-user-content::before {
  position: absolute;
  right: 115px;
  content: "";
  border-width: 10px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: black;
  border-bottom-color: transparent;
  border-right-color: transparent;
}
.feedback-content-detail-admin-user-content::after {
  position: absolute;
  right: 115px;
  content: "";
  border-width: 10px;
  border-style: solid;
  border-top-color: transparent;
  border-left-color: rgb(152, 152, 150);
  border-bottom-color: transparent;
  border-right-color: transparent;
}
.feedback-content-detail-admin-user-name {
  width:  60px;
}
</style>