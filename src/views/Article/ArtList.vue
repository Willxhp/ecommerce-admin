<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>文章列表</span>
      </div>
    </template>
    <!-- 搜索区域 -->
    <div class="search-box">
      <el-form :inline="true" :model="artForm">
        <el-form-item label="文章分类">
          <el-select v-model="artForm.cate_id" placeholder="请选择分类">
            <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="artForm.state" placeholder="请选择状态">
            <el-option label="已发布" value="已发布" />
            <el-option label="草稿" value="草稿" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 发表文章的按钮 -->
      <el-button type="primary" @click="submitFn">发表文章</el-button>
    </div>
  </el-card>
  <!-- 发表文章的 Dialog 对话框 -->
  <el-dialog title="发表文章" v-model="pubDialogVisible" fullscreen :before-close="handleClose" @close="handleClosed">
    <el-form :model="pubForm" :rules="pubFormRules" label-width="100px" ref="pubFormEl">
      <el-form-item label="文章标题" prop="title">
        <el-input placeholder="请输入标题" v-model="pubForm.title">
        </el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <el-select placeholder="请选择分类" style="width: 100%;" v-model="pubForm.cate_id">
          <el-option v-for="item in cateList" :key="item.id" :label="item.cate_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- 使用@vueup/vue-quill插件实现富文本编辑器 -->
      <el-form-item label="文章内容" prop="content" class="quill">
        <!-- contentType用于设置内容格式，默认是Delta对象格式 -->
        <QuillEditor toolbar="full" placeholder="请输入文章内容" v-model:content="pubForm.content" ref="quillRef" contentType="html" @blur="handleBlur"></QuillEditor>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <img src="@/assets/images/cover.jpg" alt="" class="cover" ref="coverImg">
        <input type="file" style="display: none;" accept="image/*" ref="iptRef" @change="fileChange">
      </el-form-item>
      <el-form-item>
        <el-button type="primary" link @click="uploadCoverFn">+ 上传封面</el-button>
      </el-form-item>
      <el-form-item prop="state">
        <el-button type="primary" @click="publicFn('已发布')">发布</el-button>
        <el-button type="info" @click="publicFn('草稿')">存为草稿</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script>
export default {
  name: 'ArtList'
}
</script>

<script setup>
// 注意：在webpack工作环境下，在标签和样式中写图片的静态路径是可行的，webpack会将图片一起打包并将新地址赋值给
// 图片的src属性，但是通过:src的形式动态绑定路径字符串时会出现问题，原因是webpack会将字符串视为完整的值，不会
// 将打包后图片的新地址重新赋值给src属性，而是直接将原字符串赋值给图片的src属性，所以会出现无法找到图片的错误
// 在webpack中用import引入图片资源会根据图片大小转换成base64位字符串或打包后图片的新路径
import coverImgUrl from '@/assets/images/cover.jpg'
import { reactive, ref } from 'vue'
import { getCateListAPI, uploadArticleAPI } from '@/api'
// 引入VueQuill富文本编辑器组件
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 文章分类列表
let cateList = ref([])
// 获取文章分类列表
const getCateList = async () => {
  const { data } = await getCateListAPI()
  if (data.code === 0) cateList.value = data.data
}
getCateList()
// 文章删选表单内容
const artForm = reactive({
  cate_id: '',
  state: '',
  pagenum: 1,
  pagesize: 2
})
// 控制发表文章的Dialog对话框是否显示
let pubDialogVisible = ref(false)

// 发表文章点击事件
const submitFn = () => {
  pubDialogVisible.value = true
}
// 发表文章对话框内表单数据
const pubForm = reactive({
  title: '',
  cate_id: '',
  content: '',
  cover_img: null,
  state: '' // 文章的发布状态，只有'已发布'和'草稿'两个值
})
// 发表文章对话框内表单校验规则
const pubFormRules = reactive({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { pattern: /^.{1,30}$/s, message: '文章标题必须为1-30个字符', trigger: 'blur' }
  ],
  cate_id: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '文章内容不能为空' },
    { pattern: /[^<p><br></p>]/, message: '文章内容不能为空' }
  ],
  cover_img: [
    { required: true, message: '请上传文章封面' }
  ]
})

// Dialog关闭前的回调，通过将控制显示的变量设置为false不会触发该事件
const handleClose = (done) => {
  ElMessageBox.confirm('此操作将导致文章信息丢失，是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    done()
  }).catch(() => {
    return
  })
}
// 获取文件类型input表单元素
const iptRef = ref(null)
// 获取文章封面img元素
const coverImg = ref(null)
// 获取表单对象
const pubFormEl = ref(null)
// 获取富文本编辑器对象
const quillRef = ref(null)

// 富文本编辑器的blur事件回调函数，在此处对当前表单项进行校验
const handleBlur = () => {
  pubFormEl.value.validateField('content').catch(err => console.warn(err))
}
// 上传封面点击事件
const uploadCoverFn = () => {
  // 点击表单元素触发弹出文件选择框的默认行为
  iptRef.value.click()
}
// input表单元素change事件的回调函数
const fileChange = (e) => {
  let files = e.target.files
  if (files.length === 0) return pubForm.cover_img = null
  else {
    pubForm.cover_img = files[0]
    // 前端图片预览
    let url = URL.createObjectURL(files[0])
    coverImg.value.setAttribute('src', url)
  }
  pubFormEl.value.validateField('cover_img')
}

// 发布文章点击事件
const publicFn = (str) => {
  pubForm.state = str
  // 表单提交时的兜底校验
  pubFormEl.value.validate(async valid => {
    if (valid) {
      // 创建FormData表单对象
      const fd = new FormData()
      for (let key in pubForm) {
        fd.append(key, pubForm[key])
      }
      const { data } = await uploadArticleAPI(fd)
      if (data.code !== 0) return ElMessage.error(data.message)
      ElMessage.success(data.message)
      // 发表成功后关闭Dialog对话框
      pubDialogVisible.value = false
    } else {
      return false
    }
  })
}
// Dialog关闭后的回调函数
const handleClosed = () => {
  pubFormEl.value.resetFields()
  // 对两个个特殊的表单项进行额外配置
  coverImg.value.setAttribute('src', coverImgUrl)
  // 当前使用的QuillEditor版本存在bug，修改content的值不能改变编辑器中的内容，使用手动的方式进行清空
  quillRef.value.setHTML('')
}

</script>

<style lang="less" scoped>
.card-header {
  font-size: 14px;
}

.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .el-form-item {
    margin-right: 15px;
  }
}

.quill ::v-deep .el-form-item__content {
  display: block;
}

::v-deep .ql-container {
  height: 0px;
  min-height: 300px;
}

.cover {
  width: 400px;
  height: 280px;
  object-fit: cover;
}

// 在style标签中加上scoped属性会在所有组件的根标签和原生标签上加上'data-v-哈希值'的自定义属性，
// 但是如果选择的标签是组件的内部标签，scoped不会在该标签上添加自定义属性，但是会在相应的选择器上添加属性选择器
// 由于标签上没有自定义属性，带有属性选择器的交集选择器无法正确选择对应的元素，::v-deep同样会为选择器添加属性选择器，
// 但是会写成后代选择器即 data-v-哈希值 .ql-editor 可以正确选择元素
</style>