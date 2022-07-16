# 后台管理项目说明

本项目基于Vue3.0+Element Plus开发。

## 项目架构

`@/assets`存放项目用到的静态资源。

`@/router`存放路由配置文件。

`@/store`存放vuex配置文件。

`@/components`存放普通组件。

`@/views`存放路由组件。

`@/utils/index.js`创建一个新的axios实例，用于发送Ajax请求。

`@/api/index.js`中封装调用接口的函数，每个函数只负责调用一个接口。

## 页面说明

### 注册页面register

该页面由使用Element Plus的Form表单组件构建静态页面，点击注册按钮可以实现用户注册。在发送注册请求之前会进行表单内容的合法性校验，若用户输入的信息不符合相关要求，会在页面上进行提示。注册成功后会自动跳转至登录页面。通过点击表单最下方的“去登录”按钮可以跳转到登录页面。

### 登录页面login

该页面同样使用Element Plus的Form表单组件构建静态页面，点击登录按钮，后端校验通过后会返回token字符串并自动跳转至layout页面。前端接收到token字符串后会将其保存在`vuex`中进行管理，同时做持久化本地存储。

### 布局页面layout

该页面是本项目的核心页面，使用Element plus的Container布局容器构建静态页面，页面采用`Header, Aside, Main, Footer`形式进行布局，用户主页等页面均作为二级路由展示在`Main`区域内。
