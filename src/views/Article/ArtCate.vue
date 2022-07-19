<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>文章分类</span>
        <el-button type="primary" size="mini">添加分类</el-button>
      </div>
    </template>
      <el-table style="width: 100%" border stripe :data="cateList">
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </el-table-column>
      </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'ArtCate'
}
</script>

<script setup>
import { reactive } from 'vue'
import { getCateListAPI } from '@/api'
const cateList = reactive([
  {
    id: 1,
    cate_name: '娱乐',
    cate_alias: 'entertainment'
  }
])
const getCateList = async () => {
  const { data } = await getCateListAPI()
  cateList.push(...data.data)
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