<template>
  <div class="login-body">
    <!--登录框div-->
    <div class="login-container">
      <!--登录框头部logo部分-->
      <div class="head">
        <img class="logo" src="../assets/images/logo.png" style="object-fit: contain;" />
        <div class="name">
          <div class="title">小兔鲜儿</div>
          <div class="tips">电商后台管理系统</div>
        </div>
      </div>
      <!-- loginForm是从setup内返回得到的 -->
      <el-form label-position="top" :rules="formRules" :model="loginForm" ref="loginFormEl" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model.trim="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<el-button type="primary" link>《服务条款》</el-button>
          </div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" @change="!checked">下次自动登录</el-checkbox>
          <el-button @click="resetForm" style="margin-left: 10px;">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<script setup>
import { reactive, ref } from 'vue'
import { loginAPI } from '@/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import md5 from 'js-md5'
const router = useRouter()
const store = useStore()
// el-form 组件接收一个 ref 属性，Vue 3.0 需要这样声明
const loginFormEl = ref(null)
const loginForm = reactive({
  username: '', // 账号
  password: '', // 密码
})
// 自动登录复选框
let checked = ref(false)
const formRules = reactive({
  username: [
    { required: 'true', message: '账户不能为空', trigger: 'blur' },
  ],
  password: [
    { required: 'true', message: '密码不能为空', trigger: 'blur' }
  ]
})
// 更新vuex中存储的token的方法
const updateToken = (value) => store.commit('user/updateToken', value)
// 表单提交方法
const submitForm = () => {
  loginFormEl.value.validate(async (valid) => {
    // valid 是一个布尔值，表示表单是否通过了上面 rules 的规则。
    if (valid) {
      // /adminUser/login 登录接口路径
      const data = await loginAPI({
        userName: loginForm.username,
        passwordMd5: md5(loginForm.password), // 密码需要 md5 加密
      })
      console.log(data)
      if (data.resultCode !== 200) return ElMessage.error(data.message)
      ElMessage.success('登录成功')
      // 登录成功后返回token，将其存储至vuex中
      updateToken(data.data)
      // 跳转至layout页面
      router.push('/')
    } else {
      return false;
    }
  })
}
// 重制表单内容
const resetForm = () => {
  loginFormEl.value.resetFields();
}
</script>

<style scoped lang="less">
.login-body {
  width: 100%;
  height: 100%;
  position: relative;
  background: url(@/assets/images/center-bg.png) no-repeat center;
  background-size: cover;
}
.login-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  height: 500px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0 20px 0;
    img {
      width: 150px;
      height: 100px;
      margin-right: 50px;
    }
    .title {
      font-size: 28px;
      color: #27BA9B;
      font-weight: bold;
    }
    .tips {
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }
  .login-form {
    width: 80%;
    margin: 0 auto;
  }
}
</style>