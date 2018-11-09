//app.js

var qcloud = require('./lib/index');
//app.js
var JMessage = require('./libs/jmessage-wxapplet-sdk-1.4.0.min.js');
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      });

    }
  },
  globalData: {
    jim: new JMessage({ debug: true }),
    request_url: {
      "GET_IM_INFO": 'http://student.ryit.co/site/index',//获取jm初始化信息接口
      "ADD_JM_USER": 'http://student.ryit.co/site/add-jm-user',//获取jm账号接口
      "GUANGHE_IMLOG": 'http://student.ryit.co/site/guanghe-imlog',//存储会话消息接口
      "GUANGHE_IMLOGLIST": 'http://student.ryit.co/site/guanghe-imloglist',//会话历史消息接口
      "GUANG_CUSTOMER": 'http://student.ryit.co/site/guang-customer',//获取客服接口
      "IM_REPLAY_USER": 'http://student.ryit.co/site/im-replay-user',//连接客服成功调用接口
    },
    im_own_user: '',
    im_target_user: '',
    jm_password: '123456',
    userInfo: null
  }
})