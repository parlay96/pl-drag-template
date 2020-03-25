'use strict'

const path = require('path')
const CONTEXT_PATH = '/'
module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static", // 静态资源的路径
    assetsPublicPath: CONTEXT_PATH, // 项目发布路径
    proxyTable: {
      "/pl": {
        target: "",
        changeOrigin: true,
        pathRewrite: { "^/pl": "/pl" }
      }
    }, // devServer反向代理列表 172.22.10.104:8888

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 82, // 服务端口
    autoOpenBrowser: false, //编译完成后是否自动打开浏览器
    errorOverlay: true, //在devServer中，是否启用错误输出层
    notifyOnErrors: false, //是否在系统通知区域提示错误
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // 是否使用 Eslint Loader 在编译过程中检查书写错误?
    // 格式错误会在控制台显示出来
    useEslint: true,
    // 是否在devServer中用一个单独的层显示格式错误
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static", // 静态资源的路径
    assetsPublicPath: './', // 项目的的发布路径，必须以'/'结尾,建议使用 '/CONTEXT_PATH'的模式

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: "#source-map",

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false, //是否启用Gzip压缩，如果使用nginx发布，必须选择false如果为真需要后端配置
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
