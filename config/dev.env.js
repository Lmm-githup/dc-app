'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // baseURL: '"http://123.57.242.40/dgb-api"',
  baseURL: '"http://dgapp.dchycrm.com/dgb-api/"',//测试环境
  chatURL: '"https://app.fjxzj.com/wxscrm/chat/index.php?current=guide"'
})
