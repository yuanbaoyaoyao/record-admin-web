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
            <el-form ref="formRef" status-icon :rules="rules" :model="form" label-width="60px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" type="text"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" @keyup.enter="handleLogin"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button :loading="loading" type="primary" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import store from '../../store';

const loading = ref(false)

const validateUserName = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('请输入用户名'))
    }
    callback()
}

const validatePassWord = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入密码'))
    }
    callback()
}

const rules = reactive({
    username: [{ validator: validateUserName, trigger: 'blur' }],
    password: [{ validator: validatePassWord, trigger: 'blur' }],
})
// do not use same name with ref
const form = reactive({
    username: '',
    password: ''
})

const router = useRouter();

const handleLogin = () => {
    if (!loading.value) {
        loading.value = true
        store.dispatch('LoginByUsername', form).then(() => {
            loading.value = false
            router.push({ path: '/' })
        }).catch(res => {
            console.log("catch", res)
            loading.value = false
        })
    } else {
        return false
    }
}
</script>

<style scoped>
.login-title {
    font-size: x-large;
    font-family: serif;
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
.login-title {
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