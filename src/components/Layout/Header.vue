<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse">
        <el-icon class="expand-fold-icon">
          <expand />
        </el-icon>
      </i>
      <i v-else>
        <el-icon class="expand-fold-icon">
          <fold />
        </el-icon>
      </i>
    </div>
    <div class="title">
      <a href="#">
        <img
          src="../../assets/logo_no_fonts.png"
          style="
            display: block;
            width: 90px;
            height: fit-content;
            justify-items: center;
          "
        />
      </a>
      <div class="title-info">耗材管理系统</div>
    </div>
    <div class="header-right">
      <div class="header-right-bell">
        <!-- 消息提示 -->
        <!-- <el-tooltip> -->
        <el-badge v-if="reminders > 0" :value="reminders">
          <el-button
            class="bell-icon"
            type="text"
            :icon="BellFilled"
            @click="handleGetReminder"
          >
          </el-button>
        </el-badge>
        <el-button
          v-else
          class="bell-icon"
          type="text"
          :icon="BellFilled"
          @click="handleGetReminder"
        >
        </el-button>
        <!-- </el-tooltip> -->
      </div>
      <!-- 头像 -->
      <div class="user-avator">
        <img src="{{adminAvatar}}" />
      </div>
      <!-- 头像下拉 -->
      <el-dropdown class="user-name" trigger="click">
        <span class="el-dropdown-link">
          {{ adminName }}
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item> -->
            <el-dropdown-item divided @click="logout"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <div class="reminder-dialog">
    <el-dialog v-model="dialogFormVisible" title="消息提示">
      <div v-if="dialogForm == null || dialogForm.length == 0">暂无提醒</div>
      <div
        v-for="(value, index) in dialogForm"
        :key="index"
        class="reminder-dialog-content"
      >
        <div v-if="value.userFeedbackId != null" class="reminder-dialog-detail">
          <router-link
            to="/usersFeedback"
            @click="updateReminder(dialogForm[index], index)"
          >
            <el-badge is-dot v-if="value.isRead == false">
              <i class="fas fa-users"></i>
            </el-badge>
            <el-badge v-else>
              <i class="fas fa-users"></i>
            </el-badge>
            <span> 用户名：{{ value.userName }}，有新的用户反馈 </span>
          </router-link>
          <div>
            <el-button @click="deleteReminder(dialogForm[index], index)"
              >删除</el-button
            >
          </div>
        </div>
        <div v-if="value.productSkusId != null" class="reminder-dialog-detail">
          <router-link
            to="/consumablesList"
            @click="updateReminder(dialogForm[index])"
          >
            <el-badge is-dot v-if="value.isRead == false">
              <i class="fas fa-wrench"></i>
            </el-badge>
            <el-badge v-else>
              <i class="fas fa-wrench"></i>
            </el-badge>
            <span> 耗材名：{{ value.productSkusTitle }}，有新的耗材提醒 </span>
          </router-link>
          <div>
            <el-button @click="deleteReminder(dialogForm[index], index)"
              >删除</el-button
            >
          </div>
        </div>
        <div v-if="value.orderProductId != null" class="reminder-dialog-detail">
          <router-link
            to="/ordersList"
            @click="updateReminder(dialogForm[index])"
          >
            <el-badge is-dot v-if="value.isRead == false">
              <i class="fas fa-file-alt"></i>
            </el-badge>
            <el-badge v-else>
              <i class="fas fa-file-alt"></i>
            </el-badge>
            <span> 需求号：{{ value.orderSn }}，有新的需求提醒 </span>
          </router-link>
          <div>
            <el-button @click="deleteReminder(dialogForm[index], index)"
              >删除</el-button
            >
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="updateReminderList"
            >一键已读</el-button
          >
          <el-button type="danger" @click="deleteReminderList"
            >一键清空并关闭窗口</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ArrowDown, BellFilled, Expand, Fold } from "@element-plus/icons";
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import storage from "../../utils/storage";
import { ref } from "vue";
import { ElNotification } from "element-plus";
import axios from "axios";
import { getToken } from "../../utils/auth";

const store = useStore();
const router = useRouter();
const route = useRoute();
const collapse = computed(() => store.getters.collapse);
const dialogFormVisible = ref(false);
const dialogForm = ref();
const reminders = ref(0);

let resquest = "/adminIp/adminReminder/";

const collapseChage = () => {
  store.commit("HANDLE_COLLAPSE", !collapse.value);
};

const adminName = computed(() => {
  if (store.getters.adminName != "") {
    return store.getters.adminName;
  } else {
    return storage.get("ADMIN_NAME");
  }
});

const adminAvatar = computed(() => {
  if (store.getters.adminAvatar != "") {
    return store.getters.adminAvatar;
  } else {
    return storage.get("ADEMIN_AVATAR");
  }
});

const handleGetReminder = () => {
  dialogFormVisible.value = true;
};

const getReminderList = () => {
  store.dispatch("GetReminders").then(() => {
    reminders.value = store.getters.adminReminders;
    dialogForm.value = store.getters.adminReminderForm;
  });
};

const updateReminder = (reminder, index) => {
  store.dispatch("UpdateReminder", reminder).then(() => {
    dialogForm.value.splice(index, 1);
    reminder.isRead = true;
    dialogForm.value.push(reminder);
    reminders.value--;
  });
  dialogFormVisible.value = false;
};

const updateReminderList = () => {
  store.dispatch("UpdateReminderList").then(() => {
    let tempDialogForm = [];
    for (let data of dialogForm.value) {
      data.isRead = true;
      tempDialogForm.push(data);
    }
    dialogForm.value = tempDialogForm;
    reminders.value = 0;
  });
};

const deleteReminder = (reminder, index) => {
  store.dispatch("DeleteAdminReminder", reminder).then(() => {
    dialogForm.value.splice(index, 1);
  });
};

const deleteReminderList = () => {
  store.dispatch("DeleteAdminReminderList").then(() => {
    dialogForm.value = [];
    reminders.value = 0;
    dialogFormVisible.value = false;
  });
};

//使用此方式
const logout = () => {
  store.dispatch("LogOut").then(() => {
    store.commit("HANDLE_CLEAR_TAGS");
    router.push(`/login?redirect=${route.fullPath}`);
  });
};

getReminderList();
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
.expand-fold-icon {
  font-size: 30px;
  margin-top: 25px;
}
.collapse-btn {
  float: left;
  padding: 0 25px;
  cursor: pointer;
  line-height: 70px;
  color: white;
  margin-right: 10px;
}
.bell-icon {
  background-color: #242f42;
  border: none;
  padding: 0;
  min-height: 0;
  margin-right: 20px;
}
.bell-icon :deep().el-icon {
  font-size: xx-large;
  color: white;
}
:deep().el-badge__content.is-fixed {
  margin-right: 20px;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.title {
  display: flex;
  font-size: 30px;
  text-align: left;
  margin-left: 20px;
  margin-top: 18px;
  color: white;
}
.title-info {
  margin-left: 30px;
}
.header {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #242f42;
}
.header-right {
  float: right;
  display: flex;
  padding-right: 50px;
  margin-top: -35px;
}
.header-right-bell {
  margin-right: 10px;
}

.user-avator img {
  display: block;
  margin-right: 80px;
  width: 35px;
  height: 35px;
}
.user-name {
  margin: -70px;
  margin-right: 0px;
  margin-top: 8px;
}
:deep().el-dialog {
  width: 900px;
}
.reminder-dialog :deep().el-dialog__body {
  max-height: 500px;
  font-size: x-large;
  overflow-x: hidden;
  overflow-y: scroll;
}
.reminder-dialog-content {
  margin-bottom: 10px;
}
:deep().reminder-dialog-detail {
  display: grid;
  grid-template-columns: auto 10%;
  border: 1px outset rgb(207, 186, 186);
  border-radius: 10px;
  padding: 10px;
  /* border-bottom: 1px solid black; */
}
:deep().el-badge__content.is-fixed.is-dot {
  right: 0px;
}
.svg-inline--fa {
  width: 80px;
  font-size: 40px;
}
.el-button--danger {
  margin-right: 20px;
}
</style>