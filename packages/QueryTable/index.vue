<template>
  <div class="filter-container">
    <!-- 表格上方左侧合计信息 -->
    <div class="tableTotalInfo">
      <slot name="tableTotalInfo"></slot>
    </div>
    <!-- 表格上方右侧操作按钮 -->
    <div class="operation_wrap btn_right" v-if="operaBtnList.length">
      <el-button v-for="(btn,inx) in operaBtnList" :key="inx" :type="btn.type||'primary'" :size="btn.size||'mini'" @click="btn.eventHandle" v-throttle v-hasPermi="btn.auth">{{btn.name}}</el-button>
    </div>
    <!-- 复杂场景表格右上方操作模块 -->
    <div class="operation_wrap btn_right" v-else>
      <slot name="tableOperation"></slot>
    </div>
    <!-- 包含了父作用域中的 (不含 .native 修饰器的) 所有v-on 事件。它可以通过 v-on=”$listeners” 传入内部组件——在创建更高层次的组件时非常有用 -->
    <!-- 包含了父作用域中不被props接收拿到的 (class 和 style 除外)。当一个组件没有声明任何 props 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind=”$attrs” 传入内部组件——在创建更高层次的组件时非常有用。 -->
    <Table v-bind="$attrs" ref='Table' v-on="$listeners">
      <!-- 表格操作列或复杂列 -->
      <template v-slot:operationColumn>
        <slot name="operationColumn"></slot>
      </template>
    </Table>
    <Pagination v-show="isPaging&&total>0" :total="total" :page.sync="pageInfo.page" :limit.sync="pageInfo.pageSize" @pagination="getTableData" />
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '../Pagination/index.vue'
import Table from '../Table/index.vue'
export default {
  name: 'QueryTable',
  props: {
    operaBtnList: {
      typeof: Array,
      default: () => []
    },
    isPaging: {
      typeof: Boolean,
      default: true
    },
    total: {
      typeof: Number | String,
      default: 0
    },
    pageInfo: {
      typeof: Object,
      default: function () {
        return { page: 1, pageSize: 10 }
      }
    },
    getTableData: {
      typeof: Function,
      default: () => { }
    }
  },
  methods: {
    // 设置选中
    setSelectRow({ idKey, selectAllIds }) {
      // 调用子组件提供的设置选中行方法
      this.$refs.Table.setSelectRow({ idKey, selectAllIds })
    }
  },
  components: {
    Pagination, Table
  }
}
</script>

<style scoped lang="scss">
</style>
