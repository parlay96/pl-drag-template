const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development', // 模式
  output: {
    publicPath: config.dev.assetsPublicPath, // 发布路径
    filename: '[name].js' // 输出文件命名规则
  },
  devtool: config.dev.devtool,
  devServer: {
    hot: true,
    contentBase: false,
    publicPath: config.dev.assetsPublicPath,
    historyApiFallback: {
      rewrites: [{
        from: /./,
        to: config.dev.assetsPublicPath
      }]
    },
    overlay: config.dev.errorOverlay
      ? {warnings: false, errors: true}
      : false,
    host: config.dev.host,
    port: config.dev.port,
    proxy: config.dev.proxyTable,
    // webpack出于安全考虑，因为不检查主机的应用程序容易受到DNS重新绑定攻击。但是，在我们的开发环境下，可以禁用掉disableHostCheck这一配置项。
    disableHostCheck: true,
    quiet: true // necessary for FriendlyErrorsPlugin
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      'CONTEXT_PATH': JSON.stringify(config.dev.assetsPublicPath)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: utils.resolve('index.html'),
      inject: true,
      favicon: './static/icon.ico'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  // 使用portfinder查找可用的端口
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer http
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))
      resolve(devWebpackConfig)
    }
  })
})
