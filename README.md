# pl-drag-template

## 前言
想必你一定使用过易企秀或百度H5等微场景生成工具制作过炫酷的h5页面，除了感叹其神奇之处有没有想过其实现方式呢？本文从零开始实现一个H5编辑器项目完整设计思路和主要实现步骤，并开源前后端代码。有需要的小伙伴可以按照该教程从零实现自己的H5编辑器。（实现起来并不复杂，该教程只是提供思路，并非最佳实践）

> 一个h5可视化编辑器种子, 高仿凡科建站模板。

> author: pl （刚刚才开源，更多问题请加入QQ交流群吧： 675286117）感谢点击上方的Star！！！

[点击查看pl-drag-template在线demo](https://livelypeng.github.io/pl-drag-template/pl-drag-dist/index.html)

> 大概图形: ![image](https://livelypeng.github.io/pl-drag-template/src/assets/muban.png)

> 拖动左边组件到画板区域释放即可，或者点击左边区域的组件。

> 注意： 最好使用谷歌打开，点击保存按钮就是一串json数据，你可以吧这个数据拿到其他手机平台进行渲染啦。有问题就加群
> 里面代码注释齐全，谁都看懂的哦

## 项目目录
``` javascript
  src {
     apiUrl: 请路径存放
     assets: 项目资产存在（图片等）
     components: 公用组件存放
     module: 模块位置  {
         画板模块的配置如下: {
            components: 当前模块的私有组件 {
              attributeConfig： 右边属性配置组件
              ... 其他的都是画板页面的组件
            }
            pluginLibrary: 画板的插件/模块/组件（非常重要）
            routers： 当前模块的路由表
            style： 当前画板的样式
            utils： 公用js存放库
            vuex: 当前模块的状态存储
            viewPage: 当前模块的页面
            index.js: 导出当前模块
         }
     }
     vuex: 整个项目的状态存储汇集地方
     themes: 整个项目的公用样式表集中地方
     utils: 整个项目的工具文件夹
  }
```
## 技术栈
**前端：**<br/>
`vue`: 模块化开发少不了angular，react，vue三选一，这里选择了vue。<br/>
`vuex`: 状态管理<br/>
`less`: css预编译器。<br/>
`element-ui`：不造轮子，有现成的优秀的vue组件库当然要用起来。没有的自己再封装一些就可以了。<br/>
`loadsh`：工具类<br/>

## 前端编辑器实现
编辑器的实现思路是：编辑器生成页面JSON数据，服务端负责存取JSON数据，渲染时从服务端取数据JSON交给前端模板处理。

## 启动运行
```
npm run dev
```
