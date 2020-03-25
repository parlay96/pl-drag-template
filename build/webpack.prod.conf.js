'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const config = require('../config')
const utils = require('./utils')
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',//模式
  output: {
    path: config.build.assetsRoot,//输出文件夹
    publicPath: config.build.assetsPublicPath,// 发布路径,可以是/ 或者是http://yourdomain/的形式
    filename: utils.assetsPath('js/[name].js?_=[chunkhash]'),//输出文件命名规则
    chunkFilename: utils.assetsPath('js/[id].js?_=[chunkhash]')
  },
  optimization: {
    minimize: true,
    runtimeChunk: true,
    splitChunks: { // 模块分割的选项，
      chunks: 'all',
      minSize: 30000, //默认只有当模块大小大于30Kb的时候才会启用模块分割，可以通过指定一个极小值强制对所有模块进行分割
    },
    minimizer: [
      // 对js文件进行压缩,在output之中设置了filename和chunkFilename之后，webpack4的默认压缩就无效了
      // new UglifyJsPlugin({
      //   test: /\.js($|\?)/i,
      //   uglifyOptions: {
      //     sourceMap: config.build.productionSourceMap,
      //     mangle: false // 启用代码混淆
      //   }
      // }),
      new TerserPlugin({ // 压缩js
        test: /\.js($|\?)/i,
        cache:  true,
        terserOptions: {
          compress: {
            drop_console: true, // 去掉console
            drop_debugger: true, // 去掉debugger
          },
        },
        parallel:  true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: {removeAll: true},
          // 避免 cssnano 重新计算 z-index
          safe: true,
          //所以这里选择关闭，使用postcss的autoprefixer功能
          autoprefixer: false
        },
        assetNameRegExp: /\.css\?_=[a-z0-9]*$/g
      })
    ]
  },
  externals: {},
  plugins: [
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: utils.resolve('index.html'),
      inject: true,
      minify: {
        removeComments: true,//移除注释
        collapseWhitespace: true, //合并多余空格
        removeAttributeQuotes: true//移除分号
        // 更多选项请参见:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    new webpack.DefinePlugin({
      'process.env': require('../config/prod.env'),
      'CONTEXT_PATH': JSON.stringify(config.build.assetsPublicPath)
    }),
    new MiniCssExtractPlugin({
      path: utils.assetsPath('css'),
      filename: '[name].css?_=[chunkhash]',
      chunkFilename: utils.assetsPath('css/[id].css?_=[chunkhash]')
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
})
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
module.exports = webpackConfig
