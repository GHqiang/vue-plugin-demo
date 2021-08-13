module.exports = {
  // vscode设置项关闭standard.enable即可解决控制台中的.eslintrc.js报错
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential'
  ],
  globals: {
    window: true
  },
  rules: {
    indent: [2, 2], // 缩进风格
    'max-len': [1, 500], // 单行最大字符(防止报表那里检测报错)
    'global-require': 0, // 关闭require必须在头
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    eqeqeq: 2,
    'no-eval': 1,
    'comma-dangle': [2, 'never'] // 对象字面量项尾不能有逗号
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
