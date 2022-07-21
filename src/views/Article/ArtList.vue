<template>
  <el-card class="box-card">
    <!-- 头部区域 -->
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
          <el-button type="primary" @click="chooseFn">筛选</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="resetFn">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 发表文章的按钮 -->
      <el-button type="primary" @click="submitFn">发表文章</el-button>
    </div>

    <!-- 文章列表表格区域 -->
    <el-table :data="artList" border stripe style="width: 100%">
      <el-table-column prop="title" label="文章标题">
        <template #default="{row}">
          <el-link type="primary" @click="showDetailFn(row.id)">{{row.title}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="文章分类" />
      <el-table-column prop="pub_date" label="发布时间">
        <template #default="{row}">
          <span>{{format(row.pub_date)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="文章状态" />
      <el-table-column label="操作">
        <template #default="{row}">
          <el-button type="primary" :disabled="row.state === '草稿'? false : true" @click="editArtFn(row.id)">编辑</el-button>
          <el-button type="danger" @click="deleteArtFn(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" v-model:page-size="artForm.pagesize" v-model:current-page="artForm.pagenum" :pager-count="11" :page-sizes="[2, 5, 10]" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-card>

  <!-- 发表文章的 Dialog 对话框 -->
  <!-- destroy-on-close属性可以让对话框关闭后将组件销毁 -->
  <el-dialog title="发表文章" v-model="pubDialogVisible" fullscreen destroy-on-close :before-close="handleClose" @close="handleClosed">
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

  <!-- 查看文章详情的Dialog对话框 -->
  <el-dialog v-model="detailVisible" title="文章详情预览" width="80%">
    <h1 class="title">{{artDetail.title}}</h1>
    <div class="info">
      <span>作者：{{artDetail.nickname || artDetail.username}}</span>
      <span>发布时间：{{ format(artDetail.pub_data) }}</span>
      <span>所属分类：{{ artDetail.cate_name }}</span>
      <span>状态：{{ artDetail.state }}</span>
    </div>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <!-- 文章封面 -->
    <img v-if="artDetail.cover_img" :src="`${baseURL}${artDetail.cover_img}`" alt="" style="width: 400px; height: 280px; object-fit: cover;">
    <!-- 文章内容 -->
    <div v-html="artDetail.content" class="main-content"></div>
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
import { reactive, ref, nextTick } from 'vue'
// 获取接口API
import { getCateListAPI, uploadArticleAPI, getArtListAPI, getArtDetailAPI, deleteArtAPI } from '@/api'
// 引入VueQuill富文本编辑器组件
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
// 引入格式化日期函数
import format from '@/utils/format'
// 引入后端接口的根路径
import { baseURL } from '@/utils'

// 文章分类列表
let cateList = ref([])
// 获取文章分类列表
const getCateList = async () => {
  const { data } = await getCateListAPI()
  if (data.code === 0) cateList.value = data.data
}
getCateList()
// 页面展示文章的相关信息
const artForm = reactive({
  cate_id: '',
  state: '',
  pagenum: 1,
  pagesize: 5
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

// 当前正在编辑的文章id
let artId = ref(0)
// 定义一个标记变量用于标识目前是否处于编辑文章的状态
// false表示新发表文章，true表示编辑已有文章
let isEdit = ref(false)
// 发布文章点击事件
const publicFn = (str) => {
  pubForm.state = str
  // 表单提交时的兜底校验
  pubFormEl.value.validate(async valid => {
    if (valid) {
      // 校验通过后首先判断当前是否处于编辑状态
      if (isEdit.value) {
        // 如果处于编辑状态，先将原文章删除后，再重新进行表单提交
        const { data } = await deleteArtAPI(artId.value)
        if (data.code !== 0) {
          ElMessage.error('修改文章失败！')
          return pubDialogVisible.value = false
        }
      }
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
      // 发表成功后重新获取表单列表
      getArtList()
    } else {
      return false
    }
  })
}
// Dialog关闭后的回调函数
const handleClosed = () => {
  pubFormEl.value.resetFields()
  // 将封面img的src属性设置为初始值
  coverImg.value.setAttribute('src', coverImgUrl)
  // Dialog关闭后将isEdit重置为false
  if (isEdit.value) isEdit.value = false
}

// 文章列表
let artList = ref([])
// 文章总数
let total = ref(0)
// 页面创建时调用接口获取文章列表
const getArtList = async () => {
  const { data } = await getArtListAPI(artForm)
  if (data.code === 0) {
    // 获取数据后，更新文章列表和总数
    artList.value = data.data
    total.value = data.total
  }
}
getArtList()

// 定义一个标记变量用于判断是否已经对数据进行过筛选
// 处于筛选状态需要将artForm表单中的state和cate_id一并传给后台
// 若未处于筛选状态，则需要将state和cate_id恢复初始值
let isChosen = ref(false)
// 注意：以下两个回调函数在通过修改artForm相关属性值的条件下不会触发
// 只有通过点击页面上的相关按钮时才会触发
// pagesize改变时的回调函数
const handleSizeChange = () => {
  // 改变每页显示文章个数时重新获取文章列表
  if (!isChosen.value) {
    // 如果处于筛选状态，将state和cate_id设置为初始值
    artForm.state = ''
    artForm.cate_id = ''
  }
  artForm.pagenum = 1
  getArtList()
}
// pagenum改变时的回调函数
const handleCurrentChange = () => {
  // 改变当前页码时重新获取文章列表
  if (!isChosen.value) {
    // 如果处于筛选状态，将state和cate_id设置为初始值
    artForm.state = ''
    artForm.cate_id = ''
  }
  getArtList()
}

// 筛选按钮的点击事件
const chooseFn = () => {
  // 点击筛选按钮后将标记变量设置为true，表示当前进入筛选状态
  isChosen.value = true
  artForm.pagesize = 5
  artForm.pagenum = 1
  getArtList()
}

// 重置按钮的点击事件
const resetFn = () => {
  // 点击重置按钮后将标记变量设置为false
  isChosen.value = false
  artForm.pagesize = 5
  artForm.pagenum = 1
  artForm.state = ''
  artForm.cate_id = ''
  getArtList()
}

// 控制文章详情对话框的显示
let detailVisible = ref(false)
// 文章详情
const artDetail = ref({})
// 查看文章详情点击事件
const showDetailFn = async id => {
  detailVisible.value = true
  // 根据文章id获取文章详情
  const { data } = await getArtDetailAPI(id)
  if (data.code !== 0) return ElMessage.error(data.message)
  artDetail.value = data.data
}

// 编辑文章按钮点击事件，只有处于草稿状态的文章可以被编辑
const editArtFn = async id => {
  const { data } = await getArtDetailAPI(id)
  if (data.code !== 0) return ElMessage.error('编辑失败！')
  // 将isEdit设置为true，表示目前正在编辑已有文章
  isEdit.value = true
  // 将当前正在编辑的文章id设置为id
  artId.value = id
  // 显示发布文章的对话框
  pubDialogVisible.value = true
  // 使用nextTick让发表文章对话框表单中的初始数据为原始值
  nextTick(() => {
    // 将pubForm内的信息恢复成当前编辑文章的信息
    pubForm.title = data.data.title
    pubForm.cate_id = data.data.cate_id
    pubForm.content = data.data.content
    // 当前使用的quill-editor富文本编辑器插件存在bug: 通过修改content的值无法修改编辑器中的文本
    quillRef.value.setHTML(data.data.content)
    // 编辑文章后需要重新上传封面
    pubForm.cover_img = null
  })
}
// 删除文章按钮点击事件
const deleteArtFn = async (id) => {
  const { data } = await deleteArtAPI(id)
  if (data.code !== 0) return ElMessage.error(data.message)
  ElMessage.success(data.message)
  getArtList()
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

.quill :deep(.el-form-item__content) {
  display: block;
}

:deep(.ql-container) {
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
// 由于标签上没有自定义属性，带有属性选择器的交集选择器无法正确选择对应的元素，:deep()可以实现样式穿透，
// 但是会写成后代选择器即 data-v-哈希值 .ql-editor 可以正确选择元素

.el-pagination {
  margin-top: 15px;
}

.title {
  font-size: 24px;
  text-align: center;
  font-weight: 400;
  color: #000;
  margin: 0 0 15px 0;
}
.info {
  font-size: 14px;
  span {
    margin-right: 20px;
  }
}
</style>