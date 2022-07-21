const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

// 定义要忽略的第三方包信息对象
let externals = {}
let CDN = { css: [], js: [] }
// 判断当前是否是生产环境
let isProduction = process.env.NODE_ENV === 'production'
if (isProduction) {
  // 如果是生成环境，配置CDN加速
  // externals对象的属性名是第三方包名，而属性值是第三方包所暴露的全局变量
  externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    dayjs: 'dayjs',
    axios: 'axios',
    echarts: 'echarts',
    '@vueup/vue-quill': 'VueQuill',
  }
  CDN = {
    css: [
      'https://unpkg.com/@vueup/vue-quill@1.0.0-beta.9/dist/vue-quill.snow.prod.css',
    ],
    js: [
      'https://unpkg.com/axios@0.27.2/dist/axios.min.js',
      'https://unpkg.com/dayjs@1.11.4/dayjs.min.js',
      'https://unpkg.com/vue@3.2.13/dist/vue.global.prod.js',
      'https://unpkg.com/vue-router@4.0.3/dist/vue-router.global.js',
      'https://unpkg.com/vuex@4.0.0/dist/vuex.global.js',
      'https://unpkg.com/@vueup/vue-quill@1.0.0-beta.9/dist/vue-quill.global.prod.js',
      'https://unpkg.com/echarts@5.3.3/dist/echarts.min.js',
    ],
  }
}

module.exports = defineConfig({
  transpileDependencies: true,
  // configureWebpack是对webpack的配置项进行修改，最终会合并到webpack的配置中
  configureWebpack: {
    // 设置Element Plus的自动引入
    plugins: [
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    // externals用于配置忽略参与项目打包的第三方包，总而利用CDN实现dist文件夹瘦身和第三方包的加载加速
    // 开发环境下不需要忽略第三方包，设置externals变量使其只在开发环境下生效
    // 在开发环境下，由于在打包时忽略了设置的第三方包，项目无法正常运行，需要在public/index.html模板中通过cdn地址引入
    // 但是如果直接写在public/index.html文件中，会导致在开发环境下引入两次第三方包导致报错
    // 所以还需要根据工作环境判断是否需要在public/index.html文件中通过cdn地址引入第三方包
    externals: externals,
  },
  // process是node的一个内置环境变量，通过process.env.NODE_ENV可以根据执行的命令自动判断当前所处的工作环境
  // process.env.NODE_ENV只有两个值: 'production'和'development'
  // publicPath用于控制打包输出的index.html引入文件时的路径前缀，在开发环境下使用'/', 在生产环境下使用'./'
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 动态向public/index.html文件中引入第三方包，代码无需理解
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].cdn = CDN // 配置CDN给插件
      return args
    })
  },
})
