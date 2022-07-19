<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>基本资料</span>
      </div>
    </template>
    <el-form :model="userForm" label-width="100px" :rules="rule" ref="userFormEl">
      <el-form-item label="登录名称">
        <el-input v-model="userForm.username" disabled />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userForm.nickname" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitFn">提交修改</el-button>
        <el-button @click="resetFn">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'UserInfo'
}
</script>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { updateUserInfoAPI } from '@/api'

// 获取store
const store = useStore()
// 定义用户信息
const userForm = reactive({
  username: store.state.userInfo.username,
  nickname: '',
  email: ''
})
// 定义表单校验规则
const rule = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '昵称必须是1-10位的大小写字母或数字', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱名称非法', trigger: 'blur' }
  ]
})
// 获取表单对象ref
const userFormEl = ref(null)
// 修改vuex中用户信息的方法
const updateuserInfo = (value) => store.dispatch('updateUserInfo')
// 提交按钮的点击事件
const submitFn = () => {
  userFormEl.value.validate(async valid => {
    if (valid) {
      userForm.id = store.state.userInfo.id
      const { data } = await updateUserInfoAPI(userForm)
      if (data.code === 0) {
        updateuserInfo()
        ElMessage({
          type: 'success',
          message: '修改信息成功！'
        })
      } else {
        ELMessage.error('修改信息失败！')
      }
    } else {
      ElMessage.error('请输入正确信息！')
      return false
    }
  })
}
// 重置按钮的点击事件
const resetFn = () => {
  // Element Plus提供的Form表单的resetFields方法不仅可以重置表单信息，而且可以重置错误提示
  userFormEl.value.resetFields()
}
</script>

<style lang="less" scoped>
.el-form {
  .card-header {
    font-size: 14px;
  }
  width: 500px;
}
</style>