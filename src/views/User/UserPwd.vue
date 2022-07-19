<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>重置密码</span>
      </div>
    </template>
    <el-form label-width="100px" :model="pwdForm" :rules="rules" ref="pwdFormEl">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input type="password" v-model="pwdForm.old_pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input type="password" v-model="pwdForm.new_pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input type="password" v-model="pwdForm.re_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwdFn">修改密码</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserPwd'
}
</script>

<script setup>
import { reactive, ref } from 'vue'
import { updateUserPwdAPI } from '@/api'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 表单对象
const pwdForm = reactive({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})

// 获取表单元素ref
const pwdFormEl = ref(null)
// 获取store
const store = useStore()
// 获取router
const router = useRouter()

// 校验新旧密码是否相同
const samePwd = (rules, value, callback) => {
  if (pwdForm.old_pwd === value) {
    callback(new Error('新旧密码不能相同!'))
  } else {
    callback()
  }
}
// 检验两次输入的密码是否相同
const rePwd = (rules, value, callback) => {
  if (pwdForm.new_pwd !== value) {
    callback('两次输入的密码不一致！')
  } else {
    callback()
  }
}

// 表单校验规则
const rules = reactive({
  old_pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' },
    { validator: samePwd, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15为的非空字符', trigger: 'blur' },
    { validator: rePwd, trigger: 'blur' }
  ]
})

// 修改密码点击事件
const updatePwdFn = () => {
  pwdFormEl.value.validate(async valid => {
    if (valid) {
      const { data } = await updateUserPwdAPI(pwdForm)
      if (data.code === 0) {
        ElMessage.success('修改密码成功，请重新登录！')
        // 修改密码后相当于用户主动退出登录，情况vuex中保存的用户信息并跳转至登录页面
        store.commit('updateToken', '')
        store.commit('updateUserInfo', {})
        router.push('/login')
      } else {
        ElMessage.error(data.message)
      }
    } else {
      ElMessage.error('请输入正确信息！')
    }
  })
}

// 重置密码点击事件
const resetFn = () => {
  pwdFormEl.value.resetFields()
}

</script>

<style lang="less" scoped>
.card-header {
  font-size: 14px;
}

.el-form {
  width: 500px;
}
</style>