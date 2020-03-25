import editorModule from './vuex'
import routes from './router'
import './style/editorTheme.less'
/**
 *  将不同的业务模块按照module分开, 每个模块将自身公开为一个插件, 在install方法中，负责注册自身的相关资源
 *  可视化编辑模块
 */
export default {
  install (Vue, { store, router }) {
    router.addRoutes(routes)
    store.registerModule('editorModule', editorModule)
  }
}
