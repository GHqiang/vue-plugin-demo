import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

// 设置表格高度
const doResize = async (el, binding, vnode) => {
  // 获取表格Dom对象
  const { componentInstance: $table, context: ctx } = await vnode
  if (!$table) return
  // ctx: vnode.context 上下文虚拟节点，这里取到的是父节点
  if (!ctx || typeof ctx[binding.arg] === 'undefined') return
  // 获取调用传递过来的数据
  const { value } = binding
  // if (!$table.height) {
  //   throw new Error(`el-$table must set the height. Such as height='100px'`)
  // }
  // 获取距底部距离（用于展示页码等信息）
  const bottomOffset = (value && value.bottomOffset) || 30
  const setMaxHeight = value && value.setMaxHeight
  // 计算列表高度并设置
  const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset
  if (setMaxHeight) { // 后续可以都换成setMaxHeight,现在这种只是为了兼容以前的才有下面的else
    setMaxHeight(height) // Tbale组件使用
  } else {
    ctx[binding.arg] = height // 页面里直接使用el-table时使用
  }

  // $table.layout.setMaxHeight(height)
  // $table.layout.setHeight(height)
  // $table.maxHeight = height
  // $table.doLayout()
}

export default {
  name: 'tableHeight',
  // 初始化设置
  bind (el, binding, vnode) {
    // 设置resize监听方法
    el.resizeListener = async () => {
      await doResize(el, binding, vnode)
    }
    // 绑定监听方法到addResizeListener
    addResizeListener(window.document.body, el.resizeListener)
  },
  // // 绑定默认高度
  async inserted (el, binding, vnode) {
    await doResize(el, binding, vnode)
  },
  // // 销毁时设置
  unbind (el) {
    // 移除resize监听
    removeResizeListener(el, el.resizeListener)
  }
}
