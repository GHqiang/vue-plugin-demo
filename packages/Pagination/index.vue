<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination :background="background" :current-page.sync="currentPage" :page-size.sync="pageSize" :layout="layout" :page-sizes="pageSizes" :total="total" v-bind="$attrs" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        // vue 修饰符sync的功能是：当一个子组件改变了一个 prop 的值时，这个变化也会同步到父组件中所绑定。
        // 父组件:limit.sync="value" 相当于 :limit="value" @update:limit="val => value = val"(快捷语法糖)
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = 1
      this.$emit('pagination', { page: 1, limit: val, pageSize: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize, pageSize: this.pageSize })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  /* background: #fff; */
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
