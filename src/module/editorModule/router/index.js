/**
 * 编辑视图模块路由
 */
import Layout from '../../../components/layoutIndex'
export default [
  {
    path: '/editor',
    component: Layout,
    name: '可视化模板',
    children: [
      {
        path: 'index',
        name: '推荐有奖',
        component: () => import('../viewPage/editorIndex')
      }
    ]
  }
]
