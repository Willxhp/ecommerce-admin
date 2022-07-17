<template>
  <div class="common-layout">
    <el-container style="height: 100%">
      <!-- 头部区域 -->
      <el-header>
        <!-- 左侧的logo -->
        <img src="@/assets/images/bnu_logo.png" alt="" class="logo" />
        <!-- <img src="@/assets/images/login_title.png" alt="" /> -->
        <span style="color: #fff; font-size: 30px;">学 生 后 台 管 理 系 统</span>
        <!-- 右侧菜单栏 -->
        <el-menu mode="horizontal" background-color="#23262E" text-color="#fff" active-text-color="#409EFF" :ellipsis="false">
          <el-sub-menu index="1">
            <template #title>
              <!-- 头像 -->
              <img src="@/assets/logo.png" alt="" class="avatar" />
              <span>个人中心</span>
            </template>
            <el-menu-item index="1-1">
              <el-icon>
                <Operation />
              </el-icon><span>基本资料</span>
            </el-menu-item>
            <el-menu-item index="1-2">
              <el-icon>
                <Camera />
              </el-icon><span>更换头像</span>
            </el-menu-item>
            <el-menu-item index="1-3">
              <el-icon>
                <Key />
              </el-icon><span>重置密码</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2" @click="logoutFn">
            <el-icon>
              <SwitchButton />
            </el-icon><span>退出</span>
          </el-menu-item>
        </el-menu>
      </el-header>
      <!-- 侧边栏区域 -->
      <el-container>
        <el-aside width="200px">
          <div class="user-info">
            <!-- 用户头像 -->
            <img v-if="userPic" :src="userPic" alt="" />
            <img v-else src="@/assets/images/avatar.jpg" alt="" />
            <!-- 用户昵称 -->
            <span>欢迎&nbsp;&nbsp;{{ nickname || username }}</span>
          </div>
          <!-- 左侧菜单栏 -->
          <el-menu active-text-color="#409EFF" @open="handleOpen" @close="handleClose" background-color="#23262E" class="el-menu-vertical-demo" default-active="/home" text-color="#fff" router unique-opened>
            <template v-for="item in menu">
              <el-menu-item :index="item.indexPath" v-if="!item.children" :key="item.indexPath">
                <el-icon>
                  <HomeFilled />
                </el-icon>
                <span style="font-size: 14px;">{{ item.title }}</span>
              </el-menu-item>
              <el-sub-menu :index="item.indexPath" v-else :key="item.indexPath">
                <template #title>
                  <el-icon>
                    <Location />
                  </el-icon>
                  <span style="font-size: 14px;">{{ item.title }}</span>
                </template>
                <el-menu-item v-for="obj in item.children" :index="obj.indexPath" :key="obj.indexPath">
                  <span style="font-size: 14px;">{{ obj.title }}</span></el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>
        <el-container>
          <!-- 页面主体区域 -->
          <el-main>Main</el-main>
          <!-- 底部footer区域 -->
          <el-footer>@ 北京师范大学 https://www.bnu.edu.cn</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Layout',
}
</script>

<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, reactive } from 'vue'
import { getMenuListAPI } from '@/api'

// 定义store
const store = useStore()
// 定义router
const router = useRouter()
// 获取vuex中的mutations
const updateToken = (value) => store.commit('updateToken', value)
const updateUserInfo = (value) => store.commit('updateUserInfo', value)

// 获取vuex中的getters
const username = computed(() => store.getters.username)
const nickname = computed(() => store.getters.nickname)
const userPic = computed(() => store.getters.userPic)
// 退出登录的点击事件
const logoutFn = () => {
  // 用户点击退出后弹出提示框询问是否确认退出
  ElMessageBox.confirm('确认退出吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 用户点击确认
      // 删除vuex中的token
      updateToken('')
      // 删除vuex中的userInfo
      updateUserInfo({})
      // 跳转至登录页面
      router.push('/login')
    })
    .catch(() => {
      // 点击取消不执行任何逻辑
    })
}

// 获取左侧菜单栏列表信息
const menu = reactive([])
const getMenuList = async () => {
  const { data } = await getMenuListAPI()
  menu.push(...data.data)
}
getMenuList()

const handleOpen = (key, keyPath) => { }
const handleClose = (key, keyPath) => { }
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
      height: 40px;
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
    background-color: #f2f2f2;
    overflow-y: scroll;
  }

  .el-footer {
    background-color: #eee;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-aside {
    .user-info {
      height: 70px;
      border-top: 1px solid #000;
      border-bottom: 1px solid #000;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 14px;
      box-sizing: border-box;
      img {
        margin-right: 5px;
        height: 35px;
        border-radius: 50%;
      }
    }

    .el-menu-vertical-demo {
      width: 201px;
    }
  }
}
</style>
