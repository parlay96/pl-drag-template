import {deepClone} from '../utils/methods'
import { getNodeElement, judgeArray } from '../utils/drawing'
import { projectConfig } from '../utils/config'

export default {
  namespaced: true,
  state: {
    // 整个页面的数据
    projectData: deepClone(projectConfig),
    parentContainerInfo: {}, // 当前父容器的对象（它有值的情况只有一种，就是我点击了容器里面的组件类型是module为true的）
    hoverChildUUID: '', // 当前被鼠标获取焦点的字节的ID
    activeElementUUID: '', // 当前选中UUID
    activeContainerIndex: '', // 当前获取焦点的容器的索引值
    middlePlaceholder: '' // 拖动左边的组件显示设置容器里面的提示“放在这里”框
  },
  mutations: {
    // 设置当前是因为点击了容器里面的模块然后需要保存当前容器信息
    // 主要用于childNodeComponent组件里面的点击module为true的组件，然后需要把父容器边框线点亮
    // 因为module为true代表不是画板元素，其实就是一个模块，但是它却由容器包裹，所以相当于点击了模块，就点击了容器
    // （设置它的情况只有一种，就是我点击了容器里面的组件类型是module为true的）不是module为true，就是个空对象
    // 你可以全局搜下哪里调用了这个方法
    setParentInfo (state, data) {
      state.parentContainerInfo = deepClone(data || {})
      // console.log(state.parentContainerInfo)
    },
    // 设置当前容器提示框是否显示（主要用于左边拖拽元素，画板需要显示“放在这里”的提示框）
    setMiddlePlaceholder (state, data) {
      state.middlePlaceholder = data
    },
    // 当前选中UUID
    setActiveElementUUID (state, data) {
      state.activeElementUUID = data
    },
    // 当前被鼠标获取焦点的子节点的ID
    setHoverChildUUID (state, data) {
      state.hoverChildUUID = data || null
    },
    // 点击左边按钮区域，添加画板节点容器(添加节点的方式一)
    addElement (state, nodeData) {
      // 获取当前需要添加的元素节点的数据结构
      const newNodeData = getNodeElement(nodeData)
      if (newNodeData) {
        // 装载到页面中
        state.projectData.elements.push(newNodeData)
      }
    },
    // 拖拽节点在整个页面画板指定的地方插入节点容器(添加节点的方式二)
    addDesignatedLocationElement (state, obj) {
      // 获取当前需要添加的元素节点的数据结构
      const newNodeData = getNodeElement(obj.nodeData)
      const index = parseInt(obj.index)
      if (newNodeData && index >= 0) {
        // 在指定地方插入节点
        state.projectData.elements.splice(index, 0, newNodeData)
      }
    },
    // 拖拽节点到容器里面插入节点元素，这是往容器里面加节点(添加节点的方式三)
    addDropNodeElement (state, obj) {
      // 获取当前需要添加的元素节点的数据结构
      const newNodeData = getNodeElement(obj.nodeData, '我是往容器里面加节点不需要被容器包裹')
      // 获取容器的索引值
      const index = parseInt(obj.index)
      if (newNodeData && index >= 0) {
        // 在容器里面插入节点
        state.projectData.elements[index].childNode.push(newNodeData)
      }
    },
    // 删除某个画板元素 || 或者删除容器
    deleteNodeElement (state, indexData) {
      if (!indexData || !judgeArray(indexData)) return
      // 如果为length长度为1代表我需要删除的是容器
      if (indexData.length === 1) {
        state.projectData.elements.splice(indexData[0], 1)
        // 如果为length长度为2，代表我需要删除的是容器里面的节点
      } else if (indexData.length === 2) {
        state.projectData.elements[indexData[0]].childNode.splice(indexData[1], 1)
      }
    },
    // 设置当前获取焦点的容器索引值
    setContainerIndex (state, index) {
      state.activeContainerIndex = index
    }
  },
  getters: {
    // 根据uuid获取节点的索引,如果当前点击节点的id是容器的子节点，那么就返回父级节点的索引，加上容器的子节点索引
    activeElementIndex: (state) => (uuid) => {
      // 根据ID找索引值
      function indexesOf (data, id) {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (item.uuid === id) return [i]
          if (item.childNode && item.childNode.length > 0) {
            const childIndexes = indexesOf(item.childNode, id)
            if (childIndexes) return [i].concat(childIndexes)
          }
        }
      }
      return indexesOf(state.projectData.elements, uuid)
    },
    // 根据子节点的id获取父节点的信息
    getParentInfo: (state) => (id) => {
      // 根据ID找父节点的id
      function findParentId (data, id) {
        let result
        if (!data) return
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          if (item.uuid === id) {
            result = item
            // 找到id相等的则返回父节点
            return result
          } else if (item.childNode && item.childNode.length > 0) {
            // 如果有子集，则把子集作为参数重新执行本方法
            result = findParentId(item.childNode, id)
            if (result) {
              return data[i]
            }
          }
        }
      }
      return findParentId(state.projectData.elements, id)
    }
  },
  actions: {
    // 获取需要删除的节点索引值
    reqDeleteNodeElement ({ getters, commit }, uuid) {
      const { activeElementIndex } = getters
      if (!uuid) return ''
      const indexData = activeElementIndex(uuid)
      commit('deleteNodeElement', indexData)
    }
  }
}
