<template>
    <div class="login">
        <div class="login-logo">
            <a href="#">
                <img
                    src="../../assets/sysLogo_noFonts.svg"
                    style="display:block;width:160px;height:auto;justify-items:center"
                />
            </a>
        </div>
        <div class="login-title">
            欢迎登录 耗材管理系统
            <!-- <span>耗材管理系统</span> -->
        </div>
        <div class="login-form">
            <el-form ref="formRef" :model="form" label-width="60px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

const onSubmit = () => {
    console.log('submit!')
}
</script>

<style scoped>
.login-title{
    font-size: x-large;
    font-family: serif ;
}
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.login-logo {
    padding-top: 30px;
    padding-bottom: 15px;
}
.login-title{
    padding: 20px;
}
.login-form {
    width: 400px;
    border: 1px solid hsl(210deg 18% 87%);
    border-radius: 6px;
}
:deep().el-button {
    width: 368px;
}
:deep().el-form-item {
    display: grid;
    grid-template-rows: auto auto;
}
:deep().el-form-item__content {
    margin-left: 0px !important;
}
:deep().el-form-item__label {
    text-align: left;
}
:deep().el-form {
    padding: 16px;
    background-color: #ecf0f38c;
}
</style>