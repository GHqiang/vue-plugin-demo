<template>
  <el-table v-loading="tableLoading" ref='tableExample' :default-sort="defaultSort" :empty-text="emptyText" @sort-change="sortChange" :max-height="maxHeight" v-tableHeight:maxHeight="maxHeightOptions" :data="tableData" :fithighlight-current-row="isFithighlight" :header-cell-class-name="headerCellClassName" @selection-change="selectionChange">
    <!-- 是否多选 -->
    <el-table-column type="selection" v-if="isBatch" :selectable="selectable" />
    <!-- 是否单选 -->
    <el-table-column v-if="isRadio" align="center" width="55">
      <template slot-scope="scope">
        <el-radio :label="scope.$index" v-model="templateRadio" @change="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
      </template>
    </el-table-column>
    <!-- 是否展示序号 -->
    <el-table-column type="index" :index="indexMethod" v-if="isSortNum" label="序号" width="70" />
    <!-- prop必须设置值合计才会生效 -->
    <el-table-column :show-overflow-tooltip="value.tooltip===false?false:true" :sortable="value.sortable" v-for="(value, key, index) in labelList" :label="value.labelText" :align="value.align||'left'" :fixed="value.isFixed" :key="index" :min-width="value.minWidth" :width="value.width">
      <template slot-scope="scope">
        <span v-if="value.isLink" :class="scope.row[key]?'linkColor':''" @click="() =>scope.row[key]?value.linkHandle(scope.row):null">{{scope.row[key] | formatHandle(value)}}</span>
        <span v-else>{{scope.row[key] | formatHandle(value)}}</span>
      </template>
    </el-table-column>
    <!-- 自定义或者操作列用来处理里面比较特殊比较复杂的比如开关什么之类的 -->
    <slot name="operationColumn"></slot>
  </el-table>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Table',
  data() {
    return {
      templateRadio: false
    }
  },
  props: {
    tableLoading: {         //  表格loading
      typeof: Boolean,
      default: false
    },
    isFithighlight: {       //  表格是否高亮当前行
      typeof: Boolean,
      default: true
    },
    headerCellClassName: {  //  表头单元格的 className
      typeof: String,
      default: 'tableHeader'
    },
    emptyText: {            //  表格空数据时的显示文本
      typeof: String,
      default: '暂无数据'
    },
    isBatch: {              //  是否需要多选
      typeof: Boolean,
      default: false
    },
    getSelectRow: {         //  多选数据改变的回调
      typeof: Function
    },
    selectable: {            //  仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
      typeof: Function
    },
    isRadio: {              //  是否需要单选
      typeof: Boolean,
      default: false
    },
    getRadioRow: {          //  单选数据改变的回调
      typeof: Function
    },
    isSortNum: {            //  是否需要显示序号
      typeof: Boolean,
      default: false
    },
    maxHeight: {            //  表格最大高度
      typeof: Number
    },
    maxHeightOptions: {     //  表格最大高度配置项
      typeof: Object,
      default: function () {
        return {
          bottomOffset: 70,       //  距离底部的高度
          setMaxHeight: () => { }  //  设置maxHeight的回调
        }
      }
    },
    tableData: {            //  表格数据           
      typeof: Array,
      require: true
    },
    pageInfo: {             //  父组件的分页信息,(显示序号时会用到)
      typeof: Object
    },
    labelList: {            //  表格json配置项
      typeof: Object,
      require: true,
      default: function () {
        return {
          // propKey: {            //  prop字段名
          //   labelText: '',      //  表头列内容
          //   minWidth: 0,        //  最小宽
          //   width: 0,           //  宽度
          //   tooltip: true,      //  超出省略号(默认true)
          //   isAmount: true,     //  是否是金额类型(金额特殊处理)
          //   align: 'right',     //  是否需要右对齐
          //   sortable: true,     //  是否排序 true-表格默认排序 custom-自定义排序(需配合sort-change监听使用)
          //   isLink: true,       //  是否可跳转
          //   linkHandle: this.toStatementList,  // 点击跳转事件
          //   formatFunc: this.formatFunc,  // 点格式化处理

          // }
        }
      }
    },
    defaultSort: {              //  默认排序项
      typeof: Object,
      default: function () {
        return {
          // prop: 'createTime', // 默认排序字段名
          // order: 'descending' // descending-降序, ascending-升序
        }
      }
    },
    sortOptions: {              //  排序方法项
      typeof: Object,
      default: function () {
        return {
          // totalKey: ''               //  合计行的key值，针对结算单列表的合计做特殊处理
          // frontSortMethod:() =>{},   //  前端自定义排序方法
          // afterSortMethod:() =>{},   //  后端自定义排序方法
        }
      }
    }
  },
  filters: {
    // 格式化处理为空显示--
    formatHandle(cellValue, value) {
      console.log(cellValue, value)
      if (value.formatFunc) {
        return value.formatFunc(cellValue)
      }
      const { isAmount } = value
      if (isAmount) {
        if (cellValue) {
          const intPart = cellValue.toString().split('.')[0] // 获取整数部分
          const floatPart = cellValue.toString().indexOf('.') ? Math.abs(cellValue).toString().split('.')[1] ? Math.abs(cellValue).toString().split('.')[1] : '00' : '00'// 获取小数部分
          const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
          const numberFormat = `${intPartFormat}.${floatPart}`
          return numberFormat
        } else {
          return '0.00'
        }
      }
      if (cellValue === 0) return cellValue.toFixed(2)
      return cellValue || '--'
    }
  },
  methods: {
    // 获取单选行数据
    getTemplateRow(index, row) {
      this.getRadioRow(row)
    },
    // 批量选择
    selectionChange(val) {
      // console.log('batchval', val)
      // 父组件利用v-on="$listeners"将事件传递下来
      this.$emit('getSelectRow', val)
      // 父组件利用v-on="$attrs"将回调函数传递下来
      // this.getSelectRow(val)
    },
    // 设置选中
    setSelectRow({ idKey, selectAllIds }) {
      this.$refs.tableExample.clearSelection()
      this.tableData.forEach((item, inx) => {
        if (selectAllIds.includes(item[idKey])) {
          this.$refs.tableExample.toggleRowSelection(this.tableData[inx], true)
        }
      })
    },
    // 自定义序号显示
    indexMethod(index) {
      const { page, pageSize } = this.pageInfo
      return index + 1 + (page - 1) * pageSize
    },
    // 前端排序
    frontSort(column) {
      // 不参与排序的数组 totalKey:合计所在列的key值 tableKey:表格的data变量名
      const { totalKey } = this.sortOptions
      const freeGood = totalKey ? this.tableData.filter(item => item[totalKey] === '合计') : []
      // 参与排序的数组
      const elseFree = totalKey ? this.tableData.filter(item => item[totalKey] !== '合计') : this.tableData
      // fieldName 为对应列的prop
      const fieldName = column.prop
      const sortingType = column.order
      // 判断是否是日期时间格式  isNaN()为false的除外
      const isDate = (str) => isNaN(str) && !isNaN(Date.parse(str)) // Date.parse===new Date().getTime()
      // 降序
      if (sortingType === 'descending') {
        // 进行排序
        this.tableData = elseFree.sort((a, b) => isDate(a[fieldName]) ? Date.parse(b[fieldName]) - Date.parse(a[fieldName]) : b[fieldName] - a[fieldName])
        totalKey && this.tableData.push(freeGood[0])
        // 如果要排序字符串
        // 可以对fieldName进行判断进行如下操作
        // this.tableData = elseFree.sort((a, b) => b[fieldName].localeCompare(a[fieldName]))
      } else {
        this.tableData = elseFree.sort((a, b) => isDate(a[fieldName]) ? Date.parse(a[fieldName]) - Date.parse(b[fieldName]) : a[fieldName] - b[fieldName])
        totalKey && this.tableData.push(freeGood[0])
      }
    },
    // 排序改变处理
    sortChange(column) {
      const { frontSortMethod, afterSortMethod } = this.sortOptions
      if (column.column.sortable === 'custom') { // 后端远程排序
        afterSortMethod && afterSortMethod(column)
      } else if (column.column.sortable) {      // 前端排序
        !frontSortMethod ? this.frontSort(column) : frontSortMethod(column)
      }
    },
    sortMethod(obj1, obj2, column) { // 不带合计行的自定义排序方法
      const isDate = (str) => isNaN(str) && !isNaN(Date.parse(str)) // Date.parse===new Date().getTime()
      let at = obj1[column]; let bt = obj2[column]
      at = isDate(at) ? Date.parse(at) : at
      bt = isDate(bt) ? Date.parse(bt) : bt
      if (at > bt) {
        return 1
      } else {
        return -1
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
