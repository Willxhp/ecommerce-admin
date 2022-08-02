# 后台管理项目说明

项目采用的技术栈有Vue3.0，Element Plus，vueRouter，vuex，less，axios等。本项目为前后端分离的论坛文章后台管理系统，用户登录后可以查看文章数据、管理文章分类、发表新文章或对当前用户已发布的文章进行编辑。

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

该页面是本项目的核心页面，使用Element Plus的Container布局容器构建静态页面，页面采用`Header, Aside, Main, Footer`形式进行布局，用户主页等页面均作为二级路由展示在`Main`区域内。`Aside`区域内采用Element Plus的Menu组件构建静态页面，可以显示当前用户的头像和用户名，若用户在信息页面编辑用户昵称后，将不再显示用户名，而是显示用户昵称。

### 主页Home

该页面采用Echarts图表库对文章数据库中的数据进行可视化展示，如显示新增文章数、分类文章数量比等。

### 文章分类页面ArtCate

该页面使用Element Plus的Table组件构建静态页面，在该页面中用户可以添加文章的分类，或者对已有文章分类进行修改或删除。

### 文章列表页面ArtList

该页面使用Element Plus的Table组件构建静态页面，用于显示当前用户已发布或处于草稿状态下的文章列表，用户可以根据文章分类或发布状态对列表进行筛选。用户可以修改处于草稿状态下的文章内容，但不能修改已发布的文章，只能将其删除。在该页面中，用户可以点击右上角的发表文章按钮，借助VueQuill提供的富文本编辑器在线编辑文章并发布。发布文章时会对文章标题、文章分类、文章内容以及文章封面进行格式校验。用户可以通过点击列表中的文章标题对文章内容进行预览。

### 用户页面User

用户页面包含用户信息UserInfo，用户头像UserAvatar和用户密码UserPwd三个页面，均采用Element Plus的Form表单组件构建静态页面，可以更新用户昵称、用户邮箱和用户头像，或者对用户密码进行重置。

## 网络请求管理

本项目采用axios进行网络请求，首先封装了request请求函数并配置项目基地址，封装api统一接口方法，在逻辑页面，需要用到哪个接口就引入对应的接口方法，调用方法后等待请求后的结果返回，在逻辑页面使用后台返回的数据。

## 项目性能优化

### CDN加速

项目中使用的第三方包，如vue，vuex，vuerouter，axios，echarts在生产环境下打包采用unpkg提供的CDN加速服务，减少打包后的项目体积，利用浏览器的缓存机制，可以提高页面的加载速度。

```js
let externals = {}
let isProduction = process.env.NODE_ENV === 'production'
// 判断是否为生产环境
if (isProduction) {
    externals = {
    	vue: 'Vue',
    	'vue-router': 'VueRouter',
    	vuex: 'Vuex',
    	dayjs: 'dayjs',
    	axios: 'axios',
    	echarts: 'echarts',
    	'@vueup/vue-quill': 'VueQuill',
  }
}
module.exports = defineConfig({
    configureWebpack: {
        externals: externals
    }
})
```

### 路由懒加载

所有路由组件均采用懒加载的方式，只有在该路由被访问到时，才加载对应的组件，提高首屏加载的速度。使用`import()`动态导入的方式实现路由懒加载。

```js
const routes = [
    {
        path: '/',
        component: () => import('@/views/Layout'),
        ...
    }
]
```

路由组件使用`<keep-alive>`组件进行包裹，将组件进行缓存。

```vue
<router-view v-slot="{Component}">
	<keep-alive>
		<component :is="Component"></component>
    </keep-alive>
</router-view>
```

### Element Plus组件按需引入

使用`unplugin-vue-components` 和 `unplugin-auto-import`这两款插件实现组件的按需自动导入。可以减少项目打包体积并且无需在组件中频繁使用`import`引入语句来手动引入组件。

```js
// vue.config.js
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  configureWebpack: {
  	plugins: [
  	  AutoImport({
  	    resolvers: [ElementPlusResolver()],
  	  }),
  	  Components({
  	    resolvers: [ElementPlusResolver()],
  	  }),
  	],
  } 
})
```
