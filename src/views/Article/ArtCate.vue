<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>文章分类</span>
        <el-button type="primary" @click="dialogVisible = true">添加分类</el-button>
      </div>
    </template>
    <el-table style="width: 100%" border stripe :data="cateList">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" @click="updateFn(scope)">修改</el-button>
          <el-button type="danger" @click="deleteFn(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 弹出提示框，新增和修改文章分类列表共用一个弹出提示框 -->
  <el-dialog v-model="dialogVisible" title="提示" width="30%" @close="handleClose">
    <el-form :model="addForm" :rules="addRules" label-width="80px" ref="addFormEl">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="addForm.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="addForm.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmFn">确认</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 点击删除按钮后的弹出提示框
  <el-dialog v-model="deleteVisible" title="提示" width="30%">
    <span>确认删除该项吗？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteConfirmFn">确认</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>

<script>
export default {
  name: 'ArtCate'
}
</script>

<script setup>
import { reactive, ref, nextTick } from 'vue'
import { getCateListAPI, addCateListAPI, updateCateListAPI, deleteCateListAPI } from '@/api'
// 文章分类列表数据
const cateList = ref([])
// 获取文章分类列表
const getCateList = async () => {
  const { data } = await getCateListAPI()
  cateList.value = data.data
}
getCateList()
// 控制弹出提示框的显示
let dialogVisible = ref(false)
// 表单内容
const addForm = reactive({
  cate_name: '',
  cate_alias: ''
})
// 表单校验规则
const addRules = reactive({
  cate_name: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    { pattern: /^\S{2,10}$/, message: '分类名称必须为2-10位的非空字符', trigger: 'blur' }
  ],
  cate_alias: [
    { required: true, message: '分类别名不能为空', trigger: 'blur' },
    { pattern: /^\S{3,15}$/, message: '分类别名必须为3-15位的非空字符', trigger: 'blur' }
  ]
})
// 获取表单元素
const addFormEl = ref(null)
// 表单关闭时的回调
const handleClose = () => {
  // 在表单关闭前将表单中的内容重置
  addFormEl.value.resetFields()
}
// 设定编辑状态, false表示新增文章列表, true表示修改文章列表
let isEdit = ref(false)
// 当前正在编辑的列表项id, 默认为空字符串，表示没有列表正在被编辑
let editId = ref('')
// 弹出框确认按钮的点击事件
const confirmFn = () => {
  addFormEl.value.validate(async valid => {
    if (valid) {
      if (isEdit.value) {
        // isEdit为true表示当前正在修改列表
        const { data } = await updateCateListAPI({ id: editId.value, ...addForm })
        if (data.code === 0) {
          ElMessage.success(data.message)
          getCateList()
        } else {
          ElMessage.error(data.message)
        }
        editId.value = ''
      } else {
        // isEdit为false表示当前正在新增列表
        const { data } = await addCateListAPI(addForm)
        if (data.code === 0) {
          ElMessage.success(data.message)
          // 重新获取文章分类列表
          getCateList()
        } else {
          ElMessage.error(data.message)
        }
      }
      dialogVisible.value = false
    } else {
      return false
    }
  })
}
// 修改分类列表项点击事件
const updateFn = ({ row }) => {
  // 通过作用域插槽可以获取表格当前行的数据信息
  dialogVisible.value = true
  isEdit.value = true
  editId.value = row.id
  // 实现表单内容的回显，此处需使用nextTick，因为Form表单的resetFields方法是将表格内容重置为初始值
  // 若不采用nextTick，如果页面刚加载时先点修改按钮，此时Form表单还未挂载到页面上，初始值已经设置成当前列表项对应的值
  // 使用nextTick让Form表单挂载到页面上之后再将内容回显到页面上，让Form表单的初始值为刚开始的空值
  nextTick(() => {
    addForm.cate_name = row.cate_name
    addForm.cate_alias = row.cate_alias
  })
}

// 删除分类列表项点击事件
const deleteFn = ({ row }) => {
  ElMessageBox.confirm('确认删除当前项吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const { data } = await deleteCateListAPI(row.id)
    if (data.code === 0) {
      ElMessage.success(data.message)
      getCateList()
    } else {
      ElMessage.error(data.message)
    } 
  }).catch(() => {
    return
  })
}
</script>

<style lang="less">
.card-header {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>