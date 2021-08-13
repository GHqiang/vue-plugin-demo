<template>
  <div class="filter-container">
    <el-row>
      <el-col :span="20">
        <!-- $attrs当前组件props中没有接受的都会转到当前组件的$attrs里面,可继续向下传递 -->
        <Form ref="formChildren" v-bind="$attrs" :formGlobal="formGlobal"></Form>
      </el-col>
      <el-col :span="4">
        <div class="btn_right">
          <el-button type="primary" size="mini" v-throttle @click="formGlobal.formEnterHandle">查询</el-button>
          <el-button size="mini" @click="handleEmpty">重置</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Form from '../Form/index.vue'
export default {
  name: 'QueryForm',
  components: { Form },
  props: {
    formGlobal: {
      type: Object,
      require: true
    }
  },
  methods: {
    handleEmpty() {
      this.$refs.formChildren.resetForm()
    }
  }
}
</script>

<style scoped>
</style>
