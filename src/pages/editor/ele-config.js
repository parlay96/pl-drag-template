// import $config from '@/config'

// 基础组件
const BasicComponents = [
    {
        title: '基础组件',
        components: [
            {
                elName: 'pl-text',
                title: '文字',
                icon: 'iconfont iconwenben',
                // 每个组件设置props来展示哪些显示哪些编辑项
                valueType: '', // 标识数据类型，用于表单组件
                defaultStyle: {
                    height: 40
                }
            },
            {
                elName: 'pl-image',
                title: '图片',
                icon: 'iconfont icontupian',
                valueType: '', // 标识数据类型，用于表单组件,
                defaultStyle: {
                    height: 200
                }
            },
            {
                elName: 'pl-button',
                title: '按钮',
                icon: 'iconfont iconanniuzu',
                // 每个组件设置props来展示哪些显示哪些编辑项
                valueType: '', // 标识数据类型，用于表单组件
                defaultStyle: {
                    width: 140,
                    height: 40,
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderColor: "#999999",
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderRadius: 4
                }
            },
            {
                elName: 'pl-rectangle-border',
                title: '分割线',
                icon: 'iconfont icon758bianjiqi_fengexian',
                valueType: '',
                defaultStyle: {
                    height: 1,
                    width: 300,
                    backgroundColor: '#999999'
                }
            },
            {
                elName: 'pl-image-carousel',
                title: '图片轮播',
                icon: 'iconfont iconshouyelunbotu',
                valueType: '', // 标识数据类型，用于表单组件,
                defaultStyle: {
                    height: 210
                }
            }
        ]
    }
]
// 表单组件
const FormComponent = [
    {
        title: '表单组件',
        components: [
            {
                elName: 'pl-input',
                title: '文本框',
                icon: 'iconfont iconwenbenkuang',
                isForm: true,
                defaultStyle: {
                    height: 38,
                    width: 250,
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderColor: "#999999",
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderRadius: 4
                }
            },
            {
                elName: 'pl-textarea',
                title: '多行文本',
                icon: 'iconfont iconwenbenkuang',
                isForm: true,
                defaultStyle: {
                    height: 58,
                    width: 250,
                    paddingTop: 6,
                    paddingBottom: 6,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderColor: "#999999",
                    borderStyle: 'solid',
                    borderWidth: 1,
                    borderRadius: 4
                }
            }
        ]
    }
]
export default [...BasicComponents, ...FormComponent]
