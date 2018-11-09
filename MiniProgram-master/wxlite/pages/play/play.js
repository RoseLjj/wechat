// pages/play/play.js
var app = getApp();
var storage = require("../../libs/storage.js");//存储storage函数(可设定失效时间)
var common = require('../../libs/public.js');//公用方法
Page({
  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    videoContext: {},
    fullScreen: false,
    playUrl: "http://tx.guangheyingyu.com/live/35853_345678.flv",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,
    exterFlag: false, //为了兼容微信iOS客户端的bug增加的控制字段，打开debug的时候把操作view remove再add

    scroll_bottom:'scroll_bottom',//聊天框最底部元素
    txt_content: '',//发送的消息
    scroll_h:'100%',//聊天窗口的高度
    message_h:0,//聊天内容高度，用于重置聊天框滚动条位置
    is_send: false,//是否可以发送消息
    is_horizontal:false,//是否横屏，
    target_rid:'12820839',//目标聊天室id
    tach_list: [],//聊天消息
  },

  // 拿到输入框发送的消息
  get_content: function (e) {
    var that = this;
    var val = e.detail.value;
    if (val == '') {
      that.setData({
        is_send: false,
      })
    } else {
      that.setData({
        is_send: true,
      })
    }
    that.setData({
      txt_content: val,
    });

  },
  //初始化聊天框的滚动条位置
  scroll_init: function () {
    console.log(72);
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.message_li_wrap').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res);
      that.setData({
        message_h: res[0].height,
      })
    })
  },
  //发送按钮点击事件
  sendMessage: function () {
    var that = this;
    if (!that.data.is_send) {
      return;
    }
    console.log(75);
    var msg_content = {}//消息内容需将头像与用户名加上
    msg_content.user_name = '用户名';
    msg_content.user_headImg = '../../images/nan.png';
    msg_content.user_text = that.data.txt_content;//消息内容
    msg_content = JSON.stringify(msg_content);//

    that.sendChatroomMsg(that.data.target_rid, msg_content);
  },

  onPlayClick:function() {

    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {
    } else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {
      }
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function() {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
      this.setData({
        is_horizontal: true,
      })
      
    } else {
      this.data.orientation = "vertical";
      this.setData({
        is_horizontal: false,
      })
    }

    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function() {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function() {
    this.setData({
      debug: !this.data.debug
    })
    var that = this;
    setTimeout(() => {
      that.setData({
        exterFlag: !that.data.exterFlag
      })
    }, 10)
  },

  onMuteClick: function() {
    this.setData({
      muted: !this.data.muted
    })
  },

  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },
  return_page:function(){
    wx.navigateBack();
  },

  onPlayEvent: function(e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '拉流多次失败',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function() {
    this.setData({
      playing: false,
      // playUrl: "rtmp://2157.liveplay.myqcloud.com/live/2157_wx_live_test1",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
      exterFlag: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function() {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var query = wx.createSelectorQuery();
    query.select('.message_li_wrap').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({
        message_h: res[0].height,
      })
    });
    console.log(common);
    var that = this;
    console.log(app);
    if (!app.globalData.jim.isInit()) {//如果没有初始化，就初始化
      that.jim_init();//初始化
    } else {//已初始化
      that.jim_login();//登录
    }

  },
  //jim初始化
  jim_init: function () {
    var that = this;
    //写入参数
    var params = new Object()
    //发起请求
    common.initData(app.globalData.request_url.GET_IM_INFO, params, function (res) {
      // data = data.data;
      console.log(res)
      app.globalData.jim.init({
        "appkey": res.appkey,
        "random_str": res.random_str,
        "signature": res.signature,
        "timestamp": res.timestamp
      }).onSuccess(function (data) {
        console.log(data);
        that.jim_login();//登录
      }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data))
      });
    })
  },
  jim_login: function () {
    console.log(296);
    var that = this;
    if (!app.globalData.jim.isLogin()) {//如果没有登录，就登录
      console.log(299);
      var jm_user = storage.get('jm_msgroom_user');
      if (common.isNullOrEmpty(jm_user)) {//如果没有jm聊天室账户,就获取一个jm聊天室账户
            storage.put('jm_msgroom_user', '18617678985');//jm账户名cookie存入
            that.login();//登录
      } else {
        // app.globalData.im_own_user = jm_user;
        that.login();//登录
      }
    } else {//已登录
    console.log(309);
      that.getgetSelfChatrooms();//查看已加入的聊天室
      // that.enterChatroom('12820839');//进入聊天室
      // get_kefu_user(function (user) {
      //   app.globalData.im_target_user = user;//将目标用户设置为当前客服
      //   // $('.to_tach').show();
      //   that.connection_success(app.globalData.im_target_user, app.globalData.im_own_user)//连接成功调用接口发送推送消息
      // });
    }
  },
  //jm账户登录
  login: function (user, password) {
    console.log(318);
    var that = this;
    var username = '18617678985';
    var password = '123456';
    try {
      app.globalData.jim.login({
        'username': username,
        'password': password
      }).onSuccess(function (data) {
        console.log(data);
        that.getgetSelfChatrooms();//查看已加入的聊天室
        // that.enterChatroom('12820839');//进入聊天室
      }).onFail(function (data) {
        //同上
        console.log(data)
      });
    }
    catch (err) {
      console.log(err);
      // alert('登录失败，请关闭页面重新登录')
    }

  },
  //获取已加入的聊天室
  getgetSelfChatrooms:function(){
    app.globalData.jim.getSelfChatrooms().onSuccess(function (data) {
      console.log(data)
      if (data.chat_rooms[0].id == '12820839'){//如果已经进入本聊天室
        
      }else{
        //未进入聊天室就进入
        that.enterChatroom('12820839');//进入聊天室
      }
      //data.code 返回码
      //data.message 描述
      //data.chat_rooms[].id 聊天室 id
      //data.chat_rooms[].name 聊天室名字
      //data.chat_rooms[].description 聊天室描述
      //data.chat_rooms[].appkey 聊天室所属 appkey
      //data.chat_rooms[].total_member_count 当前聊天室人数
      //data.chat_rooms[].max_member_count 聊天室最大容量
    }).onFail(function (data) {
      console.log(data);
      //data.code 返回码
      //data.message 描述
    });
  },
  //进入聊天室
  // id:聊天室id
  enterChatroom:function(id){
    app.globalData.jim.enterChatroom({
      'id': id
    }).onSuccess(function (data) {//进入聊天室
      console.log(data);

      //data.code 返回码
      //data.message 描述
      //data.id 聊天室 id
    }).onFail(function (data) {
      console.log(data);
      if (data.code ==881507){//已经在聊天室内

      }
      //data.code 返回码
      //data.message 描述
    });
  },
  //退出聊天室
  exitChatroom:function(){
    app.globalData.jim.exitChatroom({
      'id': '<id>'
    }).onSuccess(function (data) {
      //data.code 返回码
      //data.message 描述
      //data.id 聊天室 id
    }).onFail(function (data) {
      //data.code 返回码
      //data.message 描述
    });
  },
  //群聊消息监听
  onRoomMsg:function(){
    app.globalData.jim.onRoomMsg(function (data) {
      console.log(data);
      var msg_content = JSON.parse(data.content.msg_body.text);
      console.log(msg_content);
      that.createMsg(msg_content);
      // data.room_id 聊天室 id
      // data.msg_id 消息 id
      // data.ctime_ms 消息生成时间
      // data.content
    });
  },
  // 发送文本消息
  sendChatroomMsg:function(rid,content){
    var that=this;
    console.log(385);
    console.log(rid);
    console.log(content);
    var that=this;
    app.globalData.jim.sendChatroomMsg({
      'target_rid': rid,
      'content': content,
    }).onSuccess(function (data,msg) {
      console.log(data);
      console.log(msg);
      var msg_content = JSON.parse(msg.content.msg_body.text);
      console.log(msg_content);
      that.createMsg(msg_content);
      //data.code 返回码
      //data.message 描述
      //data.room_id 目标聊天室 id
      //data.msg_id 发送成功后的消息 id
      //data.ctime_ms 消息生成时间,毫秒
    }).onFail(function (data) {
      console.log(data);
      //data.code 返回码
      //data.message 描述
    });
  },
  //创建消息
  createMsg:function(data){
    var that=this;
    var options = {}
    options.user_name = data.user_name;//用户名
    options.user_headImg = data.user_headImg;//头像
    options.user_content = data.user_text;//消息内容

    var tach_list = that.data.tach_list;
    tach_list.push(options);
    that.setData({
      tach_list: tach_list
    });
    that.scroll_init();
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    that.onPlayClick();//播放
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.stop();

    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      // title: '直播播放器',
      // path: '/pages/play/play',
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  }
})