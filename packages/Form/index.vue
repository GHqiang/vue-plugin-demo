<template>
  <el-form :model="formData" :ref="refName" @keyup.enter.native="formGlobal.formEnterHandle" :inline="formGlobal.isInline||false" :label-position="formGlobal.labelPosition" :label-width="formGlobal.labelWith" v-if="formData" :size="formGlobal.size||'small'">
    <el-row v-if="!formGlobal.isOnlyForm">
      <el-col v-for="(value,key,inx) of formOptions" :key="inx" :span="value.span">
        <div v-if="value.title" :class="value.clsName">{{value.title}}</div>
        <el-form-item :label="formGlobal.colon?value.label+':':value.label" :prop="key" :rules="formGlobal.showType == 1?[]:value.rules" v-else>
          <!-- 简单输入框(text,number,textarea类型) -->
          <el-input v-if="!value.isTmp&&value.type==='input'" :type="value.inputType||'text'" :autosize="value.autosize" :rows="value.rows" v-model.trim="formData[key]" @change="(val) =>change(val,key,value)" :show-word-limit="value.isShowWordLimit" :maxlength="value.maxLength" clearable :placeholder="value.placeholder" />
          <!-- 混合型输入框 -->
          <el-input v-if="!value.isTmp&&value.type==='mixedInput'" :type="value.inputType||'text'" v-model.trim="formData[key]" @change="(val) =>change(val,key,value)" :show-word-limit="value.isShowWordLimit" :maxlength="value.maxLength" clearable :placeholder="value.placeholder">
            <el-select v-model="value.mixedKey" slot="prepend" placeholder="请选择" v-if="value.mixedType==='select'">
              <el-option v-for="(option,index) in value.mixedOptions" :key="index" :value="option[value.mixedValue]" :label="option[value.mixedLabel]"></el-option>
            </el-select>
            <span slot="prepend" v-if="value.prependText">{{value.prependText}}</span>
            <el-button slot="append" :icon="append.appendIcon" v-if="value.appendText">{{value.appendText}}</el-button>
          </el-input>
          <!-- 时间选择器 -->
          <el-time-picker v-if="!value.isRange&&value.type==='time'" v-model="formData[key]" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
          <el-time-picker v-if="value.isRange&&value.type==='time'" v-model="formData[key]" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始时间'" :end-placeholder="value.endPlaceholder||'结束时间'" />
          <!-- 日期选择器 -->
          <el-date-picker v-if="!value.isRange&&value.type==='date'" v-model="formData[key]" :type="value.dateTye" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
          <el-date-picker v-if="value.isRange&&value.type==='date'" v-model="formData[key]" :value-format="value.valueFormat" :format="value.showFormat" type="daterange" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始日期'" :end-placeholder="value.endPlaceholder||'结束日期' " />
          <!-- 日期时间选择器 -->
          <el-date-picker v-if="!value.isRange&&value.type==='dateTime'" v-model="formData[key]" type="datetime" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
          <el-date-picker v-if="value.isRange&&value.type==='dateTime'" v-model="formData[key]" type="datetimerange" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始时间'" :end-placeholder="value.endPlaceholder||'结束时间'" />

          <!-- 单选框 -->
          <el-radio-group v-if="!value.isTmp&&value.type==='radio'" :class="value.clsName" v-model="formData[key]" @change="(val) =>change(val,key,value)">
            <el-radio v-for="(option,inx) in value.selOptions" :label="option[value.selValue]" :key="inx">{{option[value.selLabel]}}</el-radio>
          </el-radio-group>
          <!-- 复选框 -->
          <el-checkbox-group v-if="!value.isTmp&&value.type==='checkbox'" v-model="formData[key]" :min="value.minCheckedNum" :max="value.maxCheckedNum" @change="(val) =>change(val,key,value)">
            <el-checkbox v-for="(option,inx) in value.selOptions" :label="option[value.selValue]" :key="inx">{{option[value.selLabel]}}</el-checkbox>
          </el-checkbox-group>
          <!-- 下拉框 -->
          <el-select v-if="!value.isTmp&&value.type==='select'" v-model="formData[key]" :multiple="value.isMultiple" @change="(val) =>change(val,key,value)" clearable :placeholder="value.placeholder" :class="value.clsName">
            <el-option v-for="(option,index) in value.selOptions" :key="index" :value="option[value.selValue]" :label="option[value.selLabel]"></el-option>
          </el-select>
          <!-- 临时值显示 -->
          <span v-if="value.isTmp">{{value.tmpValue||formData[key]||'暂无数据'}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item v-for="(value,key,inx) of formOptions" :key="inx" :label="formGlobal.colon?value.label+':':value.label" :prop="key" :rules="formGlobal.showType == 1?[]:value.rules" v-else>
      <!-- 简单输入框(text,number,textarea类型) -->
      <el-input v-if="!value.isTmp&&value.type==='input'" :type="value.inputType||'text'" :autosize="value.autosize" :rows="value.rows" v-model.trim="formData[key]" @change="(val) =>change(val,key,value)" :show-word-limit="value.isShowWordLimit" :maxlength="value.maxLength" clearable :placeholder="value.placeholder" />
      <!-- 复合型输入框 -->
      <el-input v-if="!value.isTmp&&value.type==='mixedInput'" :type="value.inputType||'text'" v-model="outsideOptions[key]" @change="(val) =>change(val,key,value)" :show-word-limit="value.isShowWordLimit" :maxlength="value.maxLength" clearable :placeholder="value.placeholder">
        <el-select v-model="outsideOptions[value.mixedKey]" :style="value.mixedSelectStyle" slot="prepend" placeholder="请选择" v-if="value.mixedType==='select'">
          <el-option v-for="(option,index) in value.mixedOptions" :key="index" :value="option[value.mixedValue]" :label="option[value.mixedLabel]"></el-option>
        </el-select>
        <span slot="prepend" v-if="value.prependText">{{value.prependText}}</span>
        <el-button slot="append" :icon="append.appendIcon" v-if="value.appendText">{{value.appendText}}</el-button>
      </el-input>

      <!-- 时间选择器 -->
      <el-time-picker v-if="!value.isRange&&value.type==='time'" v-model="formData[key]" :style="value.timeStyle" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
      <el-time-picker v-if="value.isRange&&value.type==='time'" v-model="outsideOptions[key]" :style="value.timeStyle" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始时间'" :end-placeholder="value.endPlaceholder||'结束时间'" />
      <!-- 日期选择器 -->
      <el-date-picker v-if="!value.isRange&&value.type==='date'" v-model="formData[key]" :style="value.timeStyle" :type="value.dateTye" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
      <el-date-picker v-if="value.isRange&&value.type==='date'" v-model="outsideOptions[key]" :style="value.timeStyle" :value-format="value.valueFormat" :format="value.showFormat" type="daterange" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始日期'" :end-placeholder="value.endPlaceholder||'结束日期' " />
      <!-- 日期时间选择器 -->
      <el-date-picker v-if="!value.isRange&&value.type==='dateTime'" v-model="formData[key]" :style="value.timeStyle" type="datetime" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" :placeholder="value.placeholder" />
      <el-date-picker v-if="value.isRange&&value.type==='dateTime'" v-model="outsideOptions[key]" :style="value.timeStyle" type="datetimerange" :value-format="value.valueFormat" :format="value.showFormat" @change="(val) =>change(val,key,value)" range-separator="至" :start-placeholder="value.startPlaceholder||'开始时间'" :end-placeholder="value.endPlaceholder||'结束时间'" />

      <!-- 单选框 -->
      <el-radio-group v-if="!value.isTmp&&value.type==='radio'" :class="value.clsName" v-model="formData[key]" @change="(val) =>change(val,key,value)">
        <el-radio v-for="(option,inx) in value.selOptions" :label="option[value.selValue]" :key="inx">{{option[value.selLabel]}}</el-radio>
      </el-radio-group>
      <!-- 复选框 -->
      <el-checkbox-group v-if="!value.isTmp&&value.type==='checkbox'" v-model="formData[key]" :min="value.minCheckedNum" :max="value.maxCheckedNum" @change="(val) =>change(val,key,value)">
        <el-checkbox v-for="(option,inx) in value.selOptions" :label="option[value.selValue]" :key="inx">{{option[value.selLabel]}}</el-checkbox>
      </el-checkbox-group>
      <!-- 下拉框 -->
      <el-select v-if="!value.isTmp&&value.type==='select'" v-model="formData[key]" :multiple="value.isMultiple" @change="(val) =>change(val,key,value)" clearable :placeholder="value.placeholder" :class="value.clsName">
        <el-option v-for="(option,index) in value.selOptions" :key="index" :value="option[value.selValue]" :label="option[value.selLabel]"></el-option>
      </el-select>
      <!-- 临时值显示 -->
      <span v-if="value.isTmp">{{value.tmpValue||formData[key]||'暂无数据'}}</span>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Form',
  props: {
    formData: { // 表单数据
      type: Object,
      require: true
    },
    refName: { // 表单ref名
      type: String
    },
    formGlobal: { // 表单的全局设置
      type: Object,
      require: true,
      default: () => {
        // isOnlyForm           是否是纯表单(不含表单项title那种)
        // isInline             是否行内表单(默认false)
        // labelPosition        表单label对齐方式(默认右对齐)
        // labelWith            表单label宽度
        // colon                表单lable是否要加冒号(默认false)
        // size                 表单尺寸(默认small)
        // showType             表单显示模式 1-查看 2修改 3-新增
        // formEnterHandle      表单键盘enter事件
      }
    },
    outsideOptions: { // 额外的表单项参数，不是真正表单的请求参数，比如时间区间和复合型select表单项
      type: Object,
      require: true,
      default: () => { }
    },
    formOptions: { // 表单的参数配置项
      type: Object,
      require: true,
      default: () => {
        // 以下皆是value配置项
        // span                 表单项span占得栅格数
        // title                表单项title内容
        // isFormItem           是否是表单项，因为列表查询有些字段不在表单里面故这样写
        // clsName              表单项可以挂载的className(目前只挂载在title上用于控制样式)
        // label                表单项label内容
        // rules                表单项验证规则
        // isTmp                是否是显示临时值
        // tmpValue             临时值显示内容
        // type                 表单项type，支持input、mixedInput、time、date、dateTime、radio、checkbox、select
        // inputType            input类型表单项的type支持number、textarea、text(默认文本)
        // maxLength            input类型表单最大占位数
        // isShowWordLimit      input类型表单是否展示输入字数
        // autosize             文本框表单自适应内容高度，如{ minRows: 2, maxRows: 6 }
        // rows                 文本框表单输入框行数,number类型

        // mixedType            复合型输入框的类型支持select和text
        // mixedKey             复合型输入框select场景下的v--model字段名
        // mixedOptions         复合型输入框select场景下字典值options
        // mixedValue           复合型输入框select场景下字典值的键值名
        // mixedLabel           复合型输入框select场景下字典值的label名
        // mixedSelectStyle     复合型输入框select场景下select标签的样式例{width:'136px'}
        // prependText          复合型输入框text场景下的前置文本内容
        // appendText           复合型输入框text场景下的后置按钮内容
        // appendIcon           复合型输入框text场景下的后置按钮icon

        // isRange              时间控件是否是区间类型的
        // valueFormat          时间控件格式化绑定值
        // showFormat           时间控件格式化展示值
        // startPlaceholder     时间控件开始的占位内容
        // endPlaceholder       时间控件结束的占位内容
        // timeStyle            时间控件标签的样式例{width:'136px'}

        // selOptions           选择框的options数据，支持单选框、复选框、下拉框
        // selValue             选择框的option的value键名
        // selLabel             选择框的option的label键名
        // minCheckedNum        复选框最小选中数量
        // maxCheckedNum        复选框最大选中数量
        // isMultiple           下拉框是否多选
      }
    }
  },
  methods: {
    change(val, key, value) {
      // console.log(val, key)
      // 如果有正则校验就去实时校验，不然表单最后提交时的校验不生效
      value.rules && value.rules.length && this.$refs[this.refName].validateField(key)
      // 如果有change事件就去执行
      value.changeCallback && value.changeCallback()
    },
    resetForm() {
      this.$refs[this.refName].resetFields()
      Object.keys(this.outsideOptions).forEach(key => {
        this.outsideOptions[key] = undefined
      })
    },
    clearValidate() {
      this.$refs[this.refName].clearValidate()
    },
    validate(callback) {
      this.$refs[this.refName].validate(callback)
    }
  }
}
</script>

<style scoped lang="scss">
.checkboxStyle {
  /deep/ .el-radio__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
  }
  /deep/ .el-radio__input.is-checked .el-radio__inner {
    background-color: #409eff;
    border-color: #409eff;
  }

  /deep/ .el-radio__inner:after {
    box-sizing: content-box;
    content: '';
    text-align: center;
    width: 7px;
    height: 3px;
    border: 2px solid white;
    border-top: transparent;
    border-right: transparent;
    text-align: center;
    top: 3px;
    left: 2px;
    border-radius: 0px;
    background: none;
    transform: rotate(300deg) scaleY(1);
  }
}
</style>
