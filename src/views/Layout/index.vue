<template>
  <div class="common-layout">
    <el-container style="height: 100%;">
      <!-- 头部区域 -->
      <el-header>
        <!-- 左侧的logo -->
        <img src="@/assets/images/bnu_logo.png" alt="" class="logo">
        <img src="@/assets/images/login_title.png" alt="">
        <!-- 右侧菜单栏 -->
        <el-menu mode="horizontal" background-color="#23262E" text-color="#fff" active-text-color="#409EFF" :ellipsis="false">
          <el-sub-menu index="1">
            <template #title>
              <!-- 头像 -->
              <img src="@/assets/logo.png" alt="" class="avatar" />
              <span>个人中心</span>
            </template>
            <el-menu-item index="1-1"><el-icon><Operation/></el-icon>基本资料</el-menu-item>
            <el-menu-item index="1-2"><el-icon><Camera/></el-icon>更换头像</el-menu-item>
            <el-menu-item index="1-3"><el-icon><Key/></el-icon>重置密码</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2" @click="logoutFn"><el-icon><SwitchButton/></el-icon>退出</el-menu-item>
        </el-menu>
      </el-header>
      <!-- 侧边栏区域 -->
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <!-- 页面主体区域 -->
          <el-main>Main</el-main>
          <!-- 底部footer区域 -->
          <el-footer>北京师范大学 https://www.bnu.edu.cn/</el-footer>
        </el-container>
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

// 定义store
const store = useStore()
// 定义router
const router = useRouter()
const updateToken = value => store.commit('updateToken', value)
// 退出登录的点击事件
const logoutFn = () => {
  // 用户点击退出后弹出提示框询问是否确认退出
  ElMessageBox.confirm(
    '确认退出吗？',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
      // 用户点击确认
      // 删除vuex中的token
      updateToken('')
      // 跳转至登录页面
      router.push('/login')
    })
    .catch(() => {
      // 点击取消不执行业余逻辑
    })
}
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-header,
  .el-aside {
    background-color: #23262e;
  }

  .el-header {
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;

    .logo {
      height: 50px;
    }

    .avatar {
      border-radius: 50%;
      width: 35px;
      height: 35px;
      margin-right: 10px;
      background-color: #fff;
    }
  }


  .el-main {
    height: 0;
    background-color: #F2F2F2;
    overflow-y: scroll;
  }

  .el-footer {
    background-color: #eee;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>