<template>
  <!-- 背景 -->
  <div class="login-container">
    <!-- 登录区域 -->
    <div class="login-box">
      <!-- 登录页头部 -->
      <div class="login-title"></div>
      <!-- 表单区域 -->
      <el-form :model="form" :rules="rule" ref="formEl">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="loginFn">登录</el-button>
          <el-link type="info" @click="router.push('/register')">去注册</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { loginAPI } from '@/api'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 引入路由router
const router = useRouter()
// 获取表单元素
const formEl = ref(null)
// 获取store
const store = useStore()
// 定义表单数据
const form = reactive({
  username: '',
  password: ''
})
// 定义表单校验规则
const rule = reactive({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10位的大小写字母或数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' }
  ],
})
// 更新vuex中存储的token的方法
const updateToken = (value) => store.commit('updateToken', value)
// 点击登录处理函数
const loginFn = () => {
  formEl.value.validate(async (valid) => {
    if (valid) {
      const { data } = await loginAPI(form)
      if (data.code !== 0) return ElMessage.error(data.message)
      ElMessage({
        message: data.message,
        type: 'success'
      })
      // 更新token
      updateToken(data.token)
      // 跳转至layout页面
      router.push('/')
    } else {
      return false
    }
  })
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/login_bg.jpg') center;
  background-size: cover;

  .login-box {
    padding: 0 30px;
    width: 400px;
    height: 270px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;

    .login-title {
      height: 60px;
      background: url('@/assets/images/login_title.png') center center no-repeat;
    }

    .el-form-item {
      margin-bottom: 30px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>