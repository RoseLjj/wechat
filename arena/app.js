//app.js
var imgUrl = require('utils/config.js').imgUrl;
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  
  globalData: {
    userInfo: null,
    imgUrl: imgUrl,
    bgcImg: [
      imgUrl + 'student/wechat/image/background/bg_02.png', //0 背景图片 0
      imgUrl + 'student/wechat/image/assets/guanbi@3x.png',  //1 关闭× 1
      imgUrl +'student/wechat/image/assets/siyecao-dingbu@3x.png', //2 左上角四叶草图片 
      imgUrl + 'student/wechat/image/pk/jianbian-pk@3x.png', //3 列表底部的渐变
      imgUrl + 'student/wechat/image/assets/yuanbao.png',//4 元宝-->头像
      imgUrl + 'student/wechat/image/assets/zhankaicailiao@3x.png',//5 游戏右侧图
      imgUrl + 'student/wechat/image/pk/ditu1@3x.png',//6 游戏背景1
      imgUrl + 'student/wechat/image/pk/nan@3x.png',//7 性别男
      imgUrl + 'student/wechat/image/pk/nv@3x.png',//8 性别女
      imgUrl + 'student/wechat/image/pk/changjinglu@3x.png', //9 游戏1右图片
      imgUrl + 'student/wechat/image/pk/ditu2@3x.png',//10 游戏背景2
      imgUrl + 'student/wechat/image/pk/shengyin@3x.png',//11 游戏2右图片
      imgUrl + 'student/wechat/image/assets/fanhui.png', //12 返回
      imgUrl + 'student/wechat/image/pk/pk@3x.png',//13 好友pk
      imgUrl + 'student/wechat/image/pk/tianjia@3x.png',//14 道具加号
      imgUrl + 'student/wechat/image/pk/lvcao@3x.png',//15 道具四叶草
      imgUrl + 'student/wechat/image/pk/wenhao@3x.png',//16 问号
      imgUrl + 'student/wechat/image/pk/baicao@3x.png',//17 白色的四叶草
      imgUrl + 'student/wechat/image/pk/fenxiang@3x.png',//18 分享
      imgUrl + 'student/wechat/image/pk/huangguan@3x.png',//19 皇冠
      imgUrl + 'student/wechat/image/pk/dianzan2@3x.png',//20 左点赞
      imgUrl + 'student/wechat/image/pk/dianzan1@3x.png',//21 右点赞
      imgUrl + 'student/wechat/image/pk/pk2@3x.png',//22 好友pk
      ],
  },
  data: {
    
  },
})