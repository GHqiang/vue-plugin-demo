import directives from './directives/index'
import './directives/debounce'
// 导入单个组件
import Form from './Form/index.vue'
import QueryForm from './QueryForm/index.vue'
import Table from './Table/index.vue'
import QueryTable from './QueryTable/index.vue'
import Pagination from './Pagination/index.vue'

// 以数组的结构保存组件，便于遍历
const components = [
  Form, QueryForm, Table, QueryTable, Pagination
]

// 定义 install 方法
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  // 遍历并注册全局组件
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  directives.forEach(direct => {
    Vue.directive(direct.name, direct)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
  // 组件列表
  ...components
}
