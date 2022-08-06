<!-- 侧边栏区域 -->
<template>
  <el-aside class="aside">
    <!--系统名称+logo-->
    <div class="head">
      <div>
        <span>电商后台管理系统</span>
      </div>
    </div>
    <!--一条为了美观的线条-->
    <div class="line" />
    <el-menu background-color="#222832" text-color="#fff" router :default-openeds="$route.path">
      <!--一级栏目-->
      <el-sub-menu index="/">
        <template #title>
          <span>Dashboard</span>
        </template>
        <!--二级栏目-->
        <el-menu-item index="home"><el-icon><DataLine /></el-icon>首页</el-menu-item>
        <el-menu-item index="addgoods"><el-icon><DataLine /></el-icon>添加商品</el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'LayoutAside'
}
</script>

<script setup>
</script>

<style lang="less" scoped>
.aside {
  width: 200px !important;
  background-color: #222832;
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    > div {
      display: flex;
      align-items: center;
      span {
        font-size: 20px;
        color: #ffffff;
      }
    }
  }
  .line {
    border-top: 1px solid hsla(0, 0%, 100%, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
}
</style>