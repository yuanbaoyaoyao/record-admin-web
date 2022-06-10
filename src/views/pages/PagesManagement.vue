<template>
  <div class="pages">
    <div class="pages-title">耗材展示</div>
    <div class="pages-second-title">前端轮播图展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicRotations.dynamicRotationsTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="
          handleRotationClose(
            dynamicRotations.dynamicRotationsIndex[
              dynamicRotations.dynamicRotationsTags.indexOf(tag)
            ]
          )
        "
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedRotationOption"
        placeholder="选择前端轮播图展示耗材"
        :options="rotationOptions"
        filterable
        @change="handleRotationOptionChange(selectedRotationOption)"
      />
    </div>
    <div class="pages-second-title">旧耗材页展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicOld.dynamicOldTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="
          handleOldClose(
            dynamicOld.dynamicOldIndex[dynamicOld.dynamicOldTags.indexOf(tag)]
          )
        "
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedOldOption"
        placeholder="选择旧耗材页展示耗材"
        :options="oldOptions"
        filterable
        @change="handleOldOptionChange(selectedOldOption)"
      />
    </div>
    <div class="pages-second-title">新耗材页展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicNew.dynamicNewTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="
          handleNewClose(
            dynamicNew.dynamicNewIndex[dynamicNew.dynamicNewTags.indexOf(tag)]
          )
        "
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedNewOption"
        placeholder="选择新耗材页展示耗材"
        :options="newOptions"
        filterable
        @change="handleNewOptionChange(selectedNewOption)"
      />
      <el-button class="pages-tags-button" type="primary" @click="handleNewTags"
        >直接展示最新加入的耗材</el-button
      >
    </div>
    <div class="pages-title">系统公告</div>
    <div>
      <el-table :data="tableData" style="width: 100%" max-height="250">
        <el-table-column prop="title" label="公告标题" width="120" />
        <el-table-column prop="content" label="公告内容" width="600" />
        <el-table-column prop="createdAt" label="创建时间" width="120" />
        <el-table-column fixed="right" label="Operations" width="240">
          <template #default="scope">
            <el-button
              link
              type="info"
              size="small"
              @click="handleUpdateAnnouncement(scope.row)"
            >
              编辑公告
            </el-button>
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDeleteAnnouncement(scope.row)"
            >
              移除公告
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        class="mt-4"
        type="primary"
        style="width: 100%"
        @click="handleAddAccountment"
        >添加新公告</el-button
      >
    </div>
  </div>
  <div class="dialog">
    <el-dialog v-model="dialogFrontShowVisible" title="选择数量">
      <el-input-number v-model="newNum" :min="1" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFrontShowVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewTags">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  <div>
    <el-dialog
      v-model="dialogAnnouncementVisible"
      :title="textMap[accountmentDialogStatus]"
    >
      <el-form :model="defaultAnnouncementForm">
        <el-form-item label="公告标题">
          <el-input
            v-model="defaultAnnouncementForm.title"
            placeholder="请输入公告标题"
          />
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input
            type="textarea"
            v-model="defaultAnnouncementForm.content"
            placeholder="请输入公告标题"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAnnouncementVisible = false">取消</el-button>
          <el-button
            v-if="accountmentDialogStatus == 'update'"
            type="primary"
            @click="updateAnnouncement"
            >确定</el-button
          >
          <el-button v-else type="primary" @click="createAnnouncement"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { listProductAllChildrenAPI } from "@/api/product-skus";
import {
  listAnnouncementAPI,
  createAnnouncementAPI,
  deleteAnnouncementAPI,
  updateAnnouncementAPI,
} from "@/api/announcement ";
import {
  listFrontShowRotationAPI,
  listFrontShowOldAPI,
  listFrontShowNewAPI,
  createFrontShowAPI,
  createFrontShowLimitNumberAPI,
  deleteFrontShowAPI,
} from "@/api/front-show";
import { ElNotification, ElMessageBox } from "element-plus";

const dynamicRotations = ref({
  dynamicRotationsTags: [],
  dynamicRotationsIndex: [],
});
const dynamicOld = ref({
  dynamicOldTags: [],
  dynamicOldIndex: [],
});
const dynamicNew = ref({
  dynamicNewTags: [],
  dynamicNewIndex: [],
});

const newNum = ref(0);
const dialogFrontShowVisible = ref(false);
const dialogAnnouncementVisible = ref(false);

const accountmentDialogStatus = ref("");
const textMap = {
  update: "编辑公告",
  create: "创建公告",
};

const rotationOptions = ref();
const oldOptions = ref();
const newOptions = ref();
const selectedRotationOption = ref();
const selectedOldOption = ref();
const selectedNewOption = ref();

const tableData = ref();

const defaultAnnouncementForm = ref({
  id: null,
  title: null,
  content: null,
});
const defaultSelectedOptionForm = ref({
  productSkusId: null,
  showRotation: 0,
  showOld: 0,
  showNew: 0,
});
const defaultDeletedOptionForm = ref({
  id: null,
});

const handleAddAccountment = () => {
  accountmentDialogStatus.value = "create";
  dialogAnnouncementVisible.value = true;
};

const createAnnouncement = () => {
  createAnnouncementAPI(defaultAnnouncementForm.value).then((res) => {
    ElNotification({
      type: "success",
      title: "创建公告成功",
    });
  });
  getAnnouncementList();
  dialogAnnouncementVisible.value = false;
};

const handleUpdateAnnouncement = (row) => {
  accountmentDialogStatus.value = "update";
  dialogAnnouncementVisible.value = true;
  defaultAnnouncementForm.value.id = row.id;
  defaultAnnouncementForm.value.title = row.title;
  defaultAnnouncementForm.value.content = row.content;
};

const updateAnnouncement = () => {
  updateAnnouncementAPI(defaultAnnouncementForm.value).then((res) => {
    ElNotification({
      type: "success",
      title: "编辑公告成功",
    });
  });
  getAnnouncementList();
  dialogAnnouncementVisible.value = false;
};

const handleDeleteAnnouncement = (row) => {
  ElMessageBox.confirm("是否确认删除公告?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    center: true,
  })
    .then(() => {
      deleteAnnouncementAPI(row).then((res) => {
        if (res.code == 200) {
          ElNotification({
            type: "success",
            message: "删除成功",
          });
        }
        getAnnouncementList();
      });
    })
    .catch(() => {
      ElNotification({
        type: "info",
        message: "取消删除",
      });
    });
};

const getProductSkusList = () => {
  listProductAllChildrenAPI().then((res) => {
    rotationOptions.value = generateTree(res.data);
    oldOptions.value = generateTree(res.data);
    newOptions.value = generateTree(res.data);
  });
};

const getAnnouncementList = () => {
  listAnnouncementAPI().then((res) => {
    tableData.value = res.data;
  });
};

const getFrontShowTagsList = () => {
  listFrontShowRotationAPI().then((res) => {
    for (let data of res.data) {
      dynamicRotations.value.dynamicRotationsTags.push(
        data.productName + "/" + data.productSkusName
      );
      dynamicRotations.value.dynamicRotationsIndex.push(data.id);
    }
    console.log("dynamicRotations:", dynamicRotations.value);
  });
  listFrontShowNewAPI().then((res) => {
    for (let data of res.data) {
      dynamicNew.value.dynamicNewTags.push(
        data.productName + "/" + data.productSkusName
      );
      dynamicNew.value.dynamicNewIndex.push(data.id);
    }
    console.log("dynamicNew:", dynamicNew.value);
  });
  listFrontShowOldAPI().then((res) => {
    for (let data of res.data) {
      dynamicOld.value.dynamicOldTags.push(
        data.productName + "/" + data.productSkusName
      );
      dynamicOld.value.dynamicOldIndex.push(data.id);
    }
    console.log("dynamicOld:", dynamicOld.value);
  });
};

const handleNewTags = () => {
  dialogFrontShowVisible.value = true;
};

const addNewTags = () => {
  let tempForm = {
    number: newNum.value,
  };
  createFrontShowLimitNumberAPI(tempForm).then((res) => {
    console.log("ressssssssssssssss:", res);
    for (let data of res.data) {
      dynamicNew.value.dynamicNewTags.push(data.productName + "/" + data.title);
      dynamicNew.value.dynamicNewIndex.push(data.id);
    }
    ElNotification({
      title: "添加新耗材页展示耗材成功",
      type: "success",
    });
  });
  dialogFrontShowVisible.value = false;
};

const generateTree = (data) => {
  let result = [];
  for (let d in data) {
    let parent = [];
    parent.value = d;
    parent.label = d;
    parent.children = [];
    for (let child of data[d]) {
      let tempChild = [];
      tempChild.value = child.id;
      tempChild.label = child.title;
      parent.children.push(tempChild);
    }
    result.push(parent);
  }
  return result;
};

const handleRotationOptionChange = (option) => {
  let selectedOptionForm = Object.assign({}, defaultSelectedOptionForm.value);
  selectedOptionForm.productSkusId = option[1];
  selectedOptionForm.showRotation = 1;
  createFrontShowAPI(selectedOptionForm).then((res) => {
    dynamicRotations.value.dynamicRotationsTags.push(
      res.data[0].productName + "/" + res.data[0].title
    );
    dynamicRotations.value.dynamicRotationsIndex.push(res.data[0].id);
    console.log("rescreateFrontShowAPI:", res);
    ElNotification({
      title: "添加轮播图展示耗材成功",
      type: "success",
    });
  });
  selectedRotationOption.value = [];
};

const handleRotationClose = (tag) => {
  let deletedOptionForm = Object.assign({}, defaultDeletedOptionForm.value);
  deletedOptionForm.id = tag;
  deleteFrontShowAPI(deletedOptionForm).then((res) => {
    dynamicRotations.value.dynamicRotationsTags.splice(
      dynamicRotations.value.dynamicRotationsTags.indexOf(tag),
      1
    );
    ElNotification({
      title: "删除轮播图展示耗材成功",
      type: "info",
    });
  });
};
const handleOldOptionChange = (option) => {
  let selectedOptionForm = Object.assign({}, defaultSelectedOptionForm.value);
  selectedOptionForm.productSkusId = option[1];
  selectedOptionForm.showOld = 1;
  console.log("handleOldOptionChange", option);
  createFrontShowAPI(selectedOptionForm).then((res) => {
    dynamicOld.value.dynamicOldTags.push(
      res.data[0].productName + "/" + res.data[0].title
    );
    dynamicOld.value.dynamicOldIndex.push(res.data[0].id);
    ElNotification({
      title: "添加旧耗材页展示耗材成功",
      type: "success",
    });
  });
  selectedOldOption.value = [];
};

const handleOldClose = (tag) => {
  let deletedOptionForm = Object.assign({}, defaultDeletedOptionForm.value);
  deletedOptionForm.id = tag;
  deleteFrontShowAPI(deletedOptionForm).then((res) => {
    dynamicOld.value.dynamicOldTags.splice(
      dynamicOld.value.dynamicOldIndex.indexOf(tag),
      1
    );
    ElNotification({
      title: "删除旧耗材展示耗材成功",
      type: "info",
    });
  });
};
const handleNewOptionChange = (option) => {
  let selectedOptionForm = Object.assign({}, defaultSelectedOptionForm.value);
  selectedOptionForm.productSkusId = option[1];
  selectedOptionForm.showNew = 1;
  createFrontShowAPI(selectedOptionForm).then((res) => {
    dynamicNew.value.dynamicNewTags.push(
      res.data[0].productName + "/" + res.data[0].title
    );
    dynamicNew.value.dynamicNewIndex.push(res.data[0].id);
    ElNotification({
      title: "添加新耗材页展示耗材成功",
      type: "success",
    });
  });
  selectedNewOption.value = [];
};

const handleNewClose = (tag) => {
  let deletedOptionForm = Object.assign({}, defaultDeletedOptionForm.value);
  deletedOptionForm.id = tag;
  deleteFrontShowAPI(deletedOptionForm).then((res) => {
    dynamicNew.value.dynamicNewTags.splice(
      dynamicNew.value.dynamicNewTags.indexOf(tag),
      1
    );
    ElNotification({
      title: "删除新耗材页展示耗材成功",
      type: "info",
    });
  });
};

getProductSkusList();
getAnnouncementList();
getFrontShowTagsList();
</script>

<style scoped>
.pages {
  padding: 10px 20px 20px 20px;
  background-color: white;
}
.pages-title,
.pages-second-title {
  padding: 10px 0px 10px 0px;
}
.pages-title {
  font-size: x-large;
}
.pages-tags {
  margin-right: 10px;
}
.pages-tags-button {
  margin-left: 30px !important;
  width: fit-content;
}
:deep().el-dialog__body {
  text-align: center;
}
</style>