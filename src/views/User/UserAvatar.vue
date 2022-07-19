<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>更换头像</span>
      </div>
    </template>
    <div>
      <!-- 用户头像图片预览区域 -->
      <img :src="avatar" v-if="avatar" class="avatar" alt="">
      <img src="@/assets/images/avatar.jpg" v-else class="avatar" alt="">
      <div class="btn-box">
        <!-- file类型的input表单的accept属性表示可以上传的文件类型 -->
        <input type="file" style="display:none;" accept="image/*" ref="iptRef" @change="handleFileChange">
        <el-button type="primary" @click="chooseImg">
          <el-icon>
            <Plus />
          </el-icon>选择图片
        </el-button>
        <el-button type="success" @click="uploadImg">
          <el-icon>
            <UploadFilled />
          </el-icon>上传头像
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'UserAvatar'
}
</script>

<script setup>
import { ref } from 'vue'
import { updateUserAvatarAPI } from '@/api'
import { useStore } from 'vuex'

// 定义store
const store = useStore()
const updateUserInfo = () => store.dispatch('updateUserInfo')
// 获取input输入框
const iptRef = ref(null)

// 用户头像的图片地址
let avatar = ref('')

// 选择图片点击事件
const chooseImg = () => {
  // 触发原生DOM的默认行为，弹出文件选择框
  iptRef.value.click()
}
// 表单文件更新处理函数
const handleFileChange = () => {
  const files = iptRef.value.files
  if (files.length !== 0) {
    // input元素的files属性保存的是一个File类型对象组成的数组
    // img的src属性值只能是图片的链接地址(外链http开头或者是文件的相对路径)或者base64格式的字符串(data:img/png;base64开头)
    // File对象不能直接作为img的src属性值，要给img做纯前端的预览，有两种方式
    // 方法1: 将文件转成内存临时地址(这个地址只能在js内存中使用，无法发送给后台)
    // 语法: URL.createObjectURL(files[0])
    // avatar.value = URL.createObjectURL(files[0])

    // 方法2: 将文件转换成base64位字符串
    const fr = new FileReader()
    // readAsDataURL方法用于将一个File文件对象转换成base64位格式的字符串
    fr.readAsDataURL(files[0])
    // fr读取文件结束后会触发load事件，通过e.target可以获取fr对象，其result属性为转换结果
    fr.onload = e => {
      avatar.value = e.target.result
    }
  }
}
// 上传图片点击事件
const uploadImg = async () => {
  const { data } = await updateUserAvatarAPI(avatar.value)
  if (data.code === 0) {
    ElMessage.success(data.message)
    updateUserInfo()
  } else {
    ElMessage.error(data.message)
  }
}
</script>

<style lang="less" scoped>
.card-header {
  font-size: 14px;
}
.avatar {
  width: 350px;
  height: 350px;
}

.btn-box {
  margin-top: 10px;
}
</style>