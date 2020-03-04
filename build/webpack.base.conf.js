'use strict'
const path = require('path')
const utils = require('./utils')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('../config')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const cssSourceMap = process.env.NODE_ENV === 'production' ? config.build.productionSourceMap : config.dev.cssSourceMap
// 创建eslint规则
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src'), utils.resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src')
    }
  },
  externals: {},
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          transformAssetUrls: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file) && !/element-ui(\\|\/)(src|packages)/.test(file)
      }, {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash].[ext]')
        }
      }, {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash].[ext]')
        }
      }, {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash].[ext]')
        }
      }, {
        test: /\.scss/,
        use: [{
          loader: process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader'
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: cssSourceMap
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: cssSourceMap
          }
        }, {
          loader: 'sass-resources-loader',
          options: {
            resources: [
              path.resolve(__dirname, '../src/common/styles/variables.scss')
            ]
          }
        }]
      }, {
        test: /\.css$/,
        use: [{
          loader: process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'vue-style-loader',
        }, {
          loader: 'css-loader',
          options: {
            sourceMap: cssSourceMap
          }
        }]
      }]
  },
  plugins: [
    new VueLoaderPlugin(),
    // 复制静态资源到目录中，如果有更多需要复制的资源，请在这里添加
    new CopyWebpackPlugin([{
      from: utils.resolve('static'),
      to: config.build.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
}
