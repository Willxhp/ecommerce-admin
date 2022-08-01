# 后台管理项目说明

本项目基于Vue3.0+Element Plus开发。技术栈：vueRouter，vuex，less，axios。

## 项目架构

```
项目文件目录
vue_management_system
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── main.js
│   ├── api
│   │   └── index.js
│   ├── assets
│   │   ├── global.css
│   │   ├── global.less
│   │   ├── images
│   │   └── logo.png
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   ├── utils
│   │   ├── format.js
│   │   └── index.js
│   └── views
│       ├── Article
│       │   ├── ArtCate.vue
│       │   └── ArtList.vue
│       ├── Home
│       │   └── index.vue
│       ├── Layout
│       │   └── index.vue
│       ├── Login
│       │   └── index.vue
│       ├── Register
│       │   └── index.vue
│       └── User
│           ├── UserAvatar.vue
│           ├── UserInfo.vue
│           └── UserPwd.vue
├── README.md
├── babel.config.js
├── jsconfig.json
├── package-lock.json
├── package.json
└── vue.config.js
```

`src`文件夹下存放项目的代码文件，在项目中用`@`表示 。

`main.js`是项目的入口文件，`App.vue`是项目的根组件。

`@/assets`存放项目用到的静态资源，如全局样式文件和images图片。

`@/router/index.js`保存vueRouter路由相关配置信息。

`@/store/index.js`保存vuex相关配置信息。

`@/views`存放路由页面组件。

`@/utils`用于存放功能函数，项目中常用的部分功能函数进行封装，方便复用。

`@/api/index.js`中封装调用接口的函数，每个函数只负责调用一个接口。

## 页面说明

本项目为单页面应用SPA，页面组件全部为路由组件，存放为`@/views`文件夹中。

### 注册页面Register

该页面由使用Element Plus的Form表单组件构建静态页面，点击注册按钮可以实现用户注册。在发送注册请求之前会进行表单内容的合法性校验，若用户输入的信息不符合相关要求，会在页面上进行提示。注册成功后会自动跳转至登录页面。通过点击表单最下方的“去登录”按钮可以跳转到登录页面。

### 登录页面Login

该页面同样使用Element Plus的Form表单组件构建静态页面，点击登录按钮，后端校验通过后会返回token字符串并自动跳转至layout页面。前端接收到token字符串后会将其保存在`vuex`中进行管理，同时做持久化本地存储。

### 布局页面Layout

该页面是本项目的核心页面，使用Element plus的Container布局容器构建静态页面，页面采用`Header, Aside, Main, Footer`形式进行布局，用户主页等页面均作为二级路由展示在`Main`区域内。

### 用户主页Home

该页面作为Layout页面的二级子路由，



## 项目性能优化

### CDN加速

### Element Plus组件按需引入



