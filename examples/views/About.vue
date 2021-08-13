<template>
  <div class="about">
    <h1>This is an about page</h1>
    <QueryForm class="queryForm" refName="queryForm" :formData="queryForm" :formOptions="formOptions" :outsideOptions="outsideOptions" :formGlobal="formGlobal" />
    <QueryTable ref="queryTable" :operaBtnList="operaBtnList" :total="total" :pageInfo="pageInfo" :getTableData="getList" :tableData="tableData" :labelList="labelList" :tableLoading="tableLoading" :isBatch="true" @getSelectRow="handleSelectionChange" :maxHeight="maxHeight" :maxHeightOptions="{setMaxHeight:(height) => maxHeight = height,bottomOffset: 70}">
      <!-- 表格上方合计信息 -->
      <template v-slot:tableTotalInfo>
        共<span>{{total}}</span>项数据，收入<span>{{totalStm&&totalStm.inSum|NumFormat}}</span> 元，支出<span>{{totalStm&&totalStm.outSum|NumFormat}}</span> 元，余额<span>{{totalStm&&totalStm.afterTradeAmount|NumFormat}}</span> 元
      </template>
      <!-- 表格操作列 -->
      <template v-slot:operationColumn>
        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="viewDetail(scope.row)" v-hasPermi="['finance:capitalAccount:detail']">查看明细</el-button>
          </template>
        </el-table-column>
      </template>
    </QueryTable>
  </div>
</template>
<script>
export default {
  name: 'About',
  data() {
    return {
      queryForm: {
        companyName: undefined,//公司名称
        inOutType: undefined, // 收支类型
        bizType: undefined, // 业务类型
        beginTime: undefined,
        endTime: undefined,
        useFlag: undefined, // 是否分页
        isPlatform: true//true平台交易流水，false城市交易流水
      },
      formGlobal: {
        isOnlyForm: true,
        labelWith: '136px',
        isInline: true,
        formEnterHandle: this.handleFilter
      },
      formOptions: {
        numberValue: {
          isFormItem: false, // 是否是真正的表单项，即字段名是传参的字段名
          label: '',
          type: 'mixedInput',
          maxLength: 20,
          placeholder: '请输入搜索内容',
          mixedType: 'select',
          mixedKey: 'numberType',
          mixedOptions: [],
          mixedValue: 'dictValue',
          mixedLabel: 'dictLabel',
          mixedSelectStyle: { width: '136px' }
        },
        companyName: {
          label: '公司名称',
          type: 'input',
          maxLength: 20,
          placeholder: '请输入公司名称'
        },
        inOutType: {
          label: '收支类型',
          type: 'select',
          maxLength: 20,
          placeholder: '全部',
          selOptions: [],
          selValue: 'dictValue',
          selLabel: 'dictLabel'
        },
        bizType: {
          label: '业务类型',
          type: 'select',
          maxLength: 20,
          placeholder: '全部',
          selOptions: [],
          selValue: 'dictValue',
          selLabel: 'dictLabel'
        },
        dateRange: {
          isFormItem: false,
          label: '创建时间',
          type: 'dateTime',
          isRange: true,
          valueFormat: "yyyy-MM-dd HH:mm:ss"
        }
      },
      outsideOptions: {
        dateRange: [], // 开始-结束时间
        numberValue: '',
        numberType: ''
      },
      pageInfo: {
        page: 1,
        pageSize: 10
      },
      searchForm: null, // 不分页的导出接口(和列表一个)查询参数
      tableLoading: false,
      tableData: [],
      maxHeight: 500,
      total: 0,
      totalStm: null,
      multipleSelection: [],
      operaBtnList: [
        { name: '导出', auth: ['finance:platformTransactionFlow:export'], eventHandle: this.handleExport }
      ],
      labelList: {
        tradeNo: {
          labelText: '云技术流水编号',
          minWidth: 160
        },
        companyName: {
          labelText: '公司名称',
          minWidth: 120
        },
        inOutTypeName: {
          labelText: '收支类型',
          minWidth: 110
        },
        amount: {
          labelText: '交易金额(元)',
          minWidth: 120,
          isAmount: true,
          align: 'right'
        },
        afterTradeAmount: {
          labelText: '交易后余额',
          minWidth: 120,
          isAmount: true,
          align: 'right'
        },
        settlementNo: {
          labelText: '结算单编号',
          minWidth: 160,
          isLink: true,
          linkHandle: this.toStatementList
        },
        bizNo: {
          labelText: '关联业务编号',
          minWidth: 160,
          isLink: true,
          linkHandle: this.toStatementList
        },
        subBizNo: {
          labelText: '关联业务子编号',
          minWidth: 265,
          isLink: true,
          linkHandle: this.toStatementList
        },
        bankTradeNo: {
          labelText: '银行流水编号',
          minWidth: 150,
          isLink: true,
          linkHandle: this.toStatementList
        },
        createTime: {
          labelText: '交易时间',
          minWidth: 160,
          align: 'right'
        }
      }
    }
  },
  created() {
    this.getDictData()
  },
  methods: {
    // 搜索数据
    handleFilter() {
      this.pageInfo.page = 1
      console.log('查询数据')
      this.getList()
    },
    handleExport() {
      console.log('用户执行了导出')
    },
    toStatementList() {
      console.log('跳往结算单列表')
    },
    viewDetail(row) {
      console.log('查看详情', row)
    },
    handleSelectionChange(val) {
      // console.log('val',val)
      this.multipleSelection = val
    },
    // 获取字典数据
    async getDictData() {
      // this.trsTypeList = await this.getDicts("syb_transaction_type").then(res => res.content)
      this.jsonFormHandeleSet('formOptions.inOutType', 'selOptions', [{ "dictLabel": "收入", "dictValue": "IN" }, { "dictValue": "OUT", "dictLabel": "支出" }])
      // this.businessTypeList = await this.getDicts("syb_platFlowBusinessType").then(res => res.content)
      this.jsonFormHandeleSet('formOptions.bizType', 'selOptions', [{ dictLabel: "线下充值", dictValue: "1" }, { dictLabel: "余额提现", dictValue: "2" }])
      // this.numberTypeList = await this.getDicts("syb_flowNumberType").then(res => res.content)
      var numberTypeList = [
        { dictValue: 'tradeNo', dictLabel: '交易流水编号' },
        { dictValue: 'settlementNo', dictLabel: '结算单编号' }
      ]
      this.jsonFormHandeleSet('formOptions.numberValue', 'mixedOptions', numberTypeList)
      if (numberTypeList.length) this.outsideOptions.numberType = numberTypeList[0].dictValue

    },
    jsonFormHandeleSet(objName, key, val) {
      const obj = objName.split('.').reduce((prev, item, inx, arr) => {
        return prev[item]
      }, this)
      this.$set(obj, key, val)
    },
    async getList() {
      const { queryForm, pageInfo } = this
      const { dateRange, numberType, numberValue } = this.outsideOptions

      queryForm.beginTime = dateRange && dateRange.length ? dateRange[0] : undefined // 后台规定时间不能传空字符串
      queryForm.endTime = dateRange && dateRange.length ? dateRange[1] : undefined // 后台规定时间不能传空字符串
      this.tableLoading = true
      try {
        this.searchForm = { ...queryForm, useFlag: false, [numberType]: numberValue || undefined } // 保存此条件导出可以直接用
        const platformTrsFlowList = () => {
          return {
            content: {
              total: 16,
              companyFlowVos: [
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "aa8a93adc0934b7781bf47444c29909f", "tradeNo": "JYC-2021080056105", "companyName": "邹测试公司", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 1698.65, "afterTradeAmount": 7713.02, "bizType": "3", "bizTypeName": "薪酬支付", "settlementNo": "JSD-2021080000015", "bizNo": "XC-2021080000008", "subBizNo": "XCLS-2021080018006", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 16:27:41", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "44bb2e84eb76472191f41fc71d4bd7a6", "tradeNo": "JYC-2021080056106", "companyName": "邹测试公司", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 17.16, "afterTradeAmount": 7695.86, "bizType": "5", "bizTypeName": "平台服务费", "settlementNo": "JSD-2021080000015", "bizNo": "XC-2021080000008", "subBizNo": "XCLS-2021080018006", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 16:27:41", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "67942645e26743a0aa4bff9e1d188cbd", "tradeNo": "JYC-2021080056103", "companyName": "邹测试公司", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 8502.45, "afterTradeAmount": 9497.55, "bizType": "3", "bizTypeName": "薪酬支付", "settlementNo": "JSD-2021080000015", "bizNo": "XC-2021080000008", "subBizNo": "XCLS-2021080018005", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 16:27:41", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "7b8ca7e647434653b6f9d5ade1d6f2aa", "tradeNo": "JYC-2021080056104", "companyName": "邹测试公司", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 85.88, "afterTradeAmount": 9411.67, "bizType": "5", "bizTypeName": "平台服务费", "settlementNo": "JSD-2021080000015", "bizNo": "XC-2021080000008", "subBizNo": "XCLS-2021080018005", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 16:27:41", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "2732a879c6674a2bb26899b98582cfa7", "tradeNo": "JYC-2021080056102", "companyName": "邹测试公司", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 2000.00, "afterTradeAmount": 18000.00, "bizType": "2", "bizTypeName": "余额提现", "settlementNo": "JSD-2021080000015", "bizNo": "TX-2021080000002", "subBizNo": null, "bankTradeNo": "12121212", "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 14:08:31", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "60ea1b0439054099b42329ae889f32c8", "tradeNo": "JYC-2021080056101", "companyName": "邹测试公司", "inOutType": "IN", "inOutTypeName": "收入", "amount": 20000.00, "afterTradeAmount": 20000.00, "bizType": "1", "bizTypeName": "线下充值", "settlementNo": "JSD-2021080000015", "bizNo": "CZ-2021080000015", "subBizNo": null, "bankTradeNo": "123123", "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-10 13:55:48", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "d0935ce987804c8399079f568040447b", "tradeNo": "JYC-2021080056011", "companyName": "北京我爱我家", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 1430.05, "afterTradeAmount": 8590625.14, "bizType": "5", "bizTypeName": "平台服务费", "settlementNo": "JSD-2021080000014", "bizNo": "XC-2021080000007", "subBizNo": "XCLS-2021080016441", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-09 15:11:57", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "899024b84dd14f92b2e6764ae27b90dc", "tradeNo": "JYC-2021080056010", "companyName": "北京我爱我家", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 17093.95, "afterTradeAmount": 8592055.19, "bizType": "3", "bizTypeName": "薪酬支付", "settlementNo": "JSD-2021080000014", "bizNo": "XC-2021080000007", "subBizNo": "XCLS-2021080016441", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-09 15:11:57", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "ce1f641444fa4d46a66d5a459de5f6e4", "tradeNo": "JYC-2021080056012", "companyName": "北京我爱我家", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 9758.61, "afterTradeAmount": 8580866.53, "bizType": "3", "bizTypeName": "薪酬支付", "settlementNo": "JSD-2021080000014", "bizNo": "XC-2021080000007", "subBizNo": "XCLS-2021080016107", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-09 15:11:57", "beginTime": null, "endTime": null, "type": null, "price": null },
                { "checkFlag": false, "cleanOrderBy": false, "total": null, "totalPage": null, "dataScope": null, "id": "0cac92a9ec8a487996aa8dfcea7457f5", "tradeNo": "JYC-2021080056007", "companyName": "北京我爱我家", "inOutType": "OUT", "inOutTypeName": "支出", "amount": 2361.55, "afterTradeAmount": 8635418.14, "bizType": "5", "bizTypeName": "平台服务费", "settlementNo": "JSD-2021080000014", "bizNo": "XC-2021080000007", "subBizNo": "XCLS-2021080016583", "bankTradeNo": null, "isPlatform": null, "bankAccount": null, "bankName": null, "remark": null, "createTime": "2021-08-09 15:11:57", "beginTime": null, "endTime": null, "type": null, "price": null }
              ],
              totalSum: {
                afterTradeAmount: 8111072.2, inSum: 30020000, outSum: 21908927.8
              }
            }
          }
        }
        var params = { ...this.searchForm, ...pageInfo }
        console.log('传参为', params)
        const { content } = await platformTrsFlowList(params)
        this.total = content.total
        this.tableData = content.companyFlowVos
        this.totalStm = content.totalSum
        if (!this.tableData.length) this.msgInfo('查询结果显示0条记录')
      } catch (error) {
        this.total = 0
        this.tableData = []
        this.totalStm = null
      } finally {
        this.tableLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.about {
  text-align: left;
  height: 100%;
  background: #f5f5f5;
  padding: 0 100px;
  box-sizing: border-box;
}
.queryForm {
  text-align: left;
}
.filter-container {
  padding-bottom: 10px;
  background-color: #fff;
  padding: 20px 20px 10px;
  margin-bottom: 10px;
}
// 表格上方合计信息样式
/deep/ .tableTotalInfo {
  letter-spacing: 1px;
  float: left;
  line-height: 28px;
  color: #999999;
  font-size: 14px;
  padding-bottom: 10px;
}
/deep/ .tableTotalInfo span {
  color: #212121;
  // font-weight: bold;
  // color: #409EFF;
  margin: 0 5px;
}
/deep/ .operation_wrap {
  float: right;
  text-align: right;
  padding-bottom: 10px;
}
.btn_right {
  text-align: right;
}
/deep/ .linkColor {
  color: #409eff;
  cursor: pointer;
}
/deep/ .pagination-container {
  margin-top: 15px;
  text-align: right;
  padding: 0 !important;
}
</style>
