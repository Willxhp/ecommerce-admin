<template>
  <div class="reg-container">
    <div class="reg-box">
      <div class="title-box"></div>
      <!-- 表单区域 -->
      <el-form ref="formEl" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input placeholder="请再次确认密码" type="password" v-model="form.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
          <el-link type="info" @click="router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register'
}
</script>

<script setup>
import { reactive, ref } from 'vue'
import { registerAPI } from '@/api'
import { useRouter } from 'vue-router'

const router = useRouter()
// 定义表单内容
const form = reactive({
  username: '',
  password: '',
  repassword: '',
})
// 自定义密码的校验规则，函数可以接收到三个参数，分别是当前表单项的校验规则对象，当前表单项的value值和一个回调函数
const samePwd = (rule, value, callback) => {
  if (value !== form.password) {
    console.log(rule)
    // 如果验证失败，则调用callback回调函数并传入一个错误对象
    callback(new Error('两次输入的密码不一致'))
  } else {
    // 如果验证成功，直接调用callback回调函数即可
    callback()
  }
}

// 获取表单元素
const formEl = ref(null)

// 定义表单校验规则
const rules = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的大小写字母或数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' }
  ],
  repassword: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' },
    // 除以上两步基本验证外，还需要比较两次输入的密码是否一致，采用自定义校验规则，配置项validator
    { validator: samePwd, trigger: 'blur' }
  ]
})
// 处理点击事件，发送注册请求
const registerFn = () => {
  // 进行兜底判断，form表单的validate方法是对整个表单的内容进行验证，接收一个回调函数，回调函数接收一个布尔值，表示验证是否通过
  formEl.value.validate(async (valid) => {
    if (valid) {
      const { data } = await registerAPI(form)
      if (data.code !== 0) return ElMessage.error(data.message)
      ElMessage({
        message: data.message,
        type: 'success'
      })
    } else {
      return false
    }
  })
}
</script>

<style lang="less" scoped>
.reg-container {
  // 背景
  width: 100%;
  height: 100%;
  background: url('@/assets/images/login_bg.jpg') center;
  background-size: cover;

  .reg-box {
    // 表单区域
    padding: 0 30px;
    width: 400px;
    height: 335px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    box-sizing: border-box;

    .title-box {
      // 表单头部标题
      height: 60px;
      background: url('@/assets/images/login_title.png') no-repeat center center;
    }

    .el-form-item {
      margin-bottom: 30px;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>