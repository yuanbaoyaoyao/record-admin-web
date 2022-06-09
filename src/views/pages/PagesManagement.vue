<template>
  <div class="pages">
    <div class="pages-title">前端轮播图展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicRotationsTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="handleRotationClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedRotationOption"
        placeholder="选择前端轮播图展示耗材"
        :options="rotationOptions"
        filterable
        @change="handleRotationOptionChange"
      />
    </div>
    <div class="pages-title">旧耗材页展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicOldTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="handleOldClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedOldOption"
        placeholder="选择旧耗材页展示耗材"
        :options="oldOptions"
        filterable
        @change="handleOldOptionChange"
      />
    </div>
    <div class="pages-title">新耗材页展示耗材</div>
    <div>
      <el-tag
        v-for="tag in dynamicNewTags"
        :key="tag"
        class="pages-tags"
        closable
        :disable-transitions="false"
        @close="handleNewClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-cascader
        v-model="selectedNewOption"
        placeholder="选择新耗材页展示耗材"
        :options="newOptions"
        filterable
        @change="handleNewOptionChange"
      />
      <el-button type="primary" @click="handleNewTags"
        >直接展示最新加入的耗材</el-button
      >
    </div>
  </div>
  <div class="dialog">
    <el-dialog v-model="dialogVisible" title="选择数量">
      <el-input-number v-model="newNum" :min="1" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addNewTags">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { listProductAllChildrenAPI } from "@/api/product-skus";
import { ElNotification } from "element-plus";

const dynamicRotationsTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const dynamicOldTags = ref(["Tag 1", "Tag 2", "Tag 3"]);
const dynamicNewTags = ref(["Tag 1", "Tag 2", "Tag 3"]);

const newNum = ref(0);
const dialogVisible = ref(false);

const rotationOptions = ref();
const oldOptions = ref();
const newOptions = ref();
const selectedRotationOption = ref();
const selectedOldOption = ref();
const selectedNewOption = ref();

const getList = () => {
  listProductAllChildrenAPI().then((res) => {
    rotationOptions.value = generateTree(res.data);
    oldOptions.value = generateTree(res.data);
    newOptions.value = generateTree(res.data);
    console.log("rotationOptions.value:", rotationOptions.value);
  });
};

const handleNewTags = () => {
  dialogVisible.value = true;
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

const handleRotationOptionChange = () => {
  ElNotification({
    title: "添加轮播图展示耗材成功",
    type: "success",
  });
  selectedRotationOption.value = [];
};

const handleRotationClose = (tag) => {
  dynamicRotationsTags.value.splice(dynamicRotationsTags.value.indexOf(tag), 1);
  ElNotification({
    title: "删除轮播图展示耗材成功",
    type: "info",
  });
};
const handleOldOptionChange = () => {
  ElNotification({
    title: "添加旧耗材页展示耗材成功",
    type: "success",
  });
  selectedOldOption.value = [];
};

const handleOldClose = (tag) => {
  dynamicOldTags.value.splice(dynamicOldTags.value.indexOf(tag), 1);
  ElNotification({
    title: "删除旧耗材页展示耗材成功",
    type: "info",
  });
};
const handleNewOptionChange = () => {
  ElNotification({
    title: "添加新耗材页展示耗材成功",
    type: "success",
  });
  selectedNewOption.value = [];
};

const handleNewClose = (tag) => {
  dynamicNewTags.value.splice(dynamicNewTags.value.indexOf(tag), 1);
  ElNotification({
    title: "删除新耗材页展示耗材成功",
    type: "info",
  });
};

getList();
</script>

<style scoped>
.pages {
  padding: 10px 20px 20px 20px;
  background-color: white;
}
.pages-title {
  padding: 10px 0px 10px 0px;
  font-size: x-large;
}
.pages-tags {
  margin-right: 10px;
}
.el-button {
  margin-left: 30px !important;
  width: fit-content;
}
:deep().el-dialog__body {
  text-align: center;
}
</style>