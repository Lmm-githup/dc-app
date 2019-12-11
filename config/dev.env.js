'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  baseURL: '"http://123.57.242.40/dgb-api/"',//测试环境
  // baseURL: '"http://192.168.111.170:9098/dgb-api"',//测试2
  // baseURL: '"http://118.31.16.15:9098/dgb-api/"'
  // baseURL: '"https://kbj.dgb.hnanrui.com/dgb-api/"',//原来
  chatURL: '"https://app.fjxzj.com/wxscrm/chat/index.php?current=guide"'
  //baseURL: '"https://shopapp.fjxzj.com/dgb-api/"',
  //chatURL: '"https://sms.fjxzj.com/wxscrm/chat/index.php?current=guide"'
})
