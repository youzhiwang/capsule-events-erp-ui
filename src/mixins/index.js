import moment from 'moment'

export default {
  filters: {
    timeFormat(val) {
      return moment(val).format('YYYY-MM-DD')
    }
  },
  methods: {
    // 非负整数验证
    noNegativeIntegerValidator(rule, value, callback) {
      const regExp = /^\d+$/
      if (regExp.test(value)) callback()
      else callback(new Error('请输入非负整数'))
    },
    // 价格验证，0 或者整数部分 9 位，小数部分 2 位
    priceValidator(rule, value, callback) {
      const regExp = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,9}(?:\.\d{0,1}[1-9])?)$/
      if (value === 0) callback()
      else {
        if (regExp.test(value)) callback()
        else callback(new Error('格式错误，小数点前最多9位，后最多2位'))
      }
    }
  }
}