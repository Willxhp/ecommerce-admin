<template>
  <div class="common-layout">
    <el-container class="container">
      <LayoutAside></LayoutAside>
      <el-container direction="vertical">
        <LayoutHeader></LayoutHeader>
        <el-main>
          <router-view ></router-view>
        </el-main>
        <LayoutFooter></LayoutFooter>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout'
}
</script>

<script setup>
import LayoutAside from '@/components/layout-aside'
import LayoutHeader from '@/components/layout-header'
import LayoutFooter from '@/components/layout-footer'

</script>

<style lang="less" scoped>
.common-layout {
  min-height: 100vh;
  background-color: #ffffff;
  .container {
    height: 100vh;
  }
}
</style>