// pages/im/kefu.js
var app = getApp();
var storage = require("../../libs/storage.js");//存储storage函数(可设定失效时间)
var common = require('../../libs/public.js');//公用方法
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tach_list: [],
    txt_content:'',//发送的消息
    is_send:false,//是否可以发送消息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(common);
    var that=this;
    console.log(app);
    if (!app.globalData.jim.isInit()) {//如果没有初始化，就初始化
      that.jim_init();//初始化
    }else{//已初始化
      that.jim_login();//登录
    }
    // common.initData('http://student.ryit.co/small-we-char/we-chart', '', function (data) {
    //   console.log(data);
    //   // if (data.errorCode == 0) {
    //   //   storage.put('jm_kefu_user', data.data.user, 10);//jm客服账户名cookie存入
    //   //   if (!common.isNullOrEmpty(fn) && typeof fn == 'function') {
    //   //     fn(data.data.service);
    //   //   }
    //   // }
    // })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  // 拿到输入框发送的消息
  get_content: function (e) {
    var that=this;
    var val = e.detail.value;
    if(val==''){
      that.setData({
        is_send:false,
      })
    }else{
      that.setData({
        is_send: true,
      })
    }
    that.setData({
      txt_content: val
    });
    
  },
  //jim初始化
    jim_init:function(){
      var that=this;
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
          console.log('success:' + JSON.stringify(data));
          that.jim_login();//登录
        }).onFail(function (data) {
          console.log('error:' + JSON.stringify(data))
        });
      })
    },
    jim_login:function(){
      var that=this;
      if (!app.globalData.jim.isLogin()) {//如果没有登录，就登录
        var jm_user = storage.get('jm_user');
        if (common.isNullOrEmpty(jm_user)) {//如果没有jm账户,就获取一个jm账户
          var params = new Object();
          common.initData(app.globalData.request_url.ADD_JM_USER,params, function (data) {
            console.log(data);
            if (data.errorCode == 0) {
              storage.put('jm_user', data.data.user, 24 * 60);//jm账户名cookie存入
              app.globalData.im_own_user = data.data.user;
              that.login(data.data.user, app.globalData.jm_password);//登录
            }
          })
        } else {
          app.globalData.im_own_user = jm_user;
          that.login(jm_user, app.globalData.jm_password);//登录
        }
      } else {//已登录，直接显示会话页面
        get_kefu_user(function (user) {
          app.globalData.im_target_user = user;//将目标用户设置为当前客服
          // $('.to_tach').show();
          that.connection_success(app.globalData.im_target_user, app.globalData.im_own_user)//连接成功调用接口发送推送消息
        });
      }
    },
    //jm账户登录
    login:function (user, password) {
      var that=this;
      var username = user;
      var password = password;
      try {
        app.globalData.jim.login({
          'username': username,
          'password': password
        }).onSuccess(function (data) {
          console.log(data)
          // 获取客服
          that.get_kefu_user(function (user) {
            console.log(user);
            app.globalData.im_target_user = user;//将目标用户设置为当前客服
            // $('.login').hide();
            // $('.to_tach').show();
            that.connection_success(app.globalData.im_target_user, app.globalData.im_own_user)//连接成功调用接口发送推送消息
            that.getHistoricalMessage(data.username, app.globalData.im_target_user);//获取历史消息
            that.onMsgReceive()//开启消息监听
          });
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
      //获取客服
    get_kefu_user:function(fn){
      var that=this;
      var jm_kefu_user = storage.get('jm_kefu_user');//客服账号
      if (common.isNullOrEmpty(jm_kefu_user)) {//如果没有jm客服账户,就获取一个jm客服账户
        var params = new Object();
        common.initData(app.globalData.request_url.GUANG_CUSTOMER, params, function (data) {
          console.log(data);
          if (data.errorCode == 0) {
            storage.put('jm_kefu_user', data.data.user, 10);//jm客服账户名cookie存入
            if (!common.isNullOrEmpty(fn) && typeof fn == 'function') {
              fn(data.data.service);
            }
          }
        })
      } else {
        if (!common.isNullOrEmpty(fn) && typeof fn == 'function') {
          fn(jm_kefu_user);
        }
      }

    },
    //客服链接成功
    connection_success: function (from,user) {
        var that=this;
        var params = new Array();
        params.push("kefu=" + from);
        params.push("user=" + user);
        common.initData(app.globalData.request_url.IM_REPLAY_USER,params,function(data){
          console.log(data);
        })
    },
    //监听聊天消息
    onMsgReceive : function (){
      var that=this;
      app.globalData.jim.onMsgReceive(function (data) {
        console.log(data);
        var options = {}
        options.target_username = data.messages[0].from_username;//用户名
        options.content = data.messages[0].content.msg_body.text;//消息内容
        options.ctime_ms = data.messages[0].ctime_ms;//消息发送时间
        options.l_or_r = 1;//消息靠左或靠右，1：左，2：右
        
        var tach_list=that.data.tach_list;
        tach_list.push(options);
        that.setData({
          tach_list: tach_list
        })
        console.log(that.data);
      });
    },
    //发送按钮点击事件
    sendMessage:function(){
      var that=this;
      // $("#content").val($("#content").val().replace(/[\r\n]/g,""));
      // return;
      if (!that.data.is_send){
        return;
      }
      var options = {};
      options.username = app.globalData.im_target_user;
      options.content = that.data.txt_content;
      //置空
      that.setData({
        txt_content: '',
        is_send:false,
      });
      //发送消息
      that.sendSingleMsg(options);
      // $('#tach_input').val('');//文本框置空
    },
    //发送单聊文本消息
    sendSingleMsg:function (opts, fn) {
      var that=this;
      console.log(opts);
      app.globalData.jim.sendSingleMsg({
        'target_username': opts.username,
        'content': opts.content,
      }).onSuccess(function (data, msg) {
        console.log(data);
        console.log(msg);
        var options = {}
        options.target_username = data.target_username;//用户名
        options.content = opts.content;//消息内容
        options.ctime_ms = data.ctime_ms;//消息发送时间
        options.l_or_r = 2;//消息靠左或靠右，1：左，2：右
        var tach_list = that.data.tach_list;
        tach_list.push(options);
        that.setData({
          tach_list: tach_list
        })
        //将消息存入数据库
        var imlog = JSON.stringify(msg.content);
        var params = new Array();
        params.push("imlog=" + imlog);
        common.initData(app.globalData.request_url.GUANGHE_IMLOG, params, function (data) {
          if (data.errorCode == 0) {
            console.log('存储成功');
          }
        })
      }).onFail(function (data) {
        console.log('error:' + JSON.stringify(data));
      });
    },
    //获取历史消息
    //from:发送人，recipient:接收人
    getHistoricalMessage: function (from, recipient) {
      var params = new Array();
      params.push("from=" + from);
      params.push("recipient=" + recipient);
      console.log(params);
      common.initData(app.globalData.request_url.GUANGHE_IMLOGLIST, params, function(data) {
        console.log(data);
        //将历史消息创建展示
        if (data.errorCode == 0) {

          for (var key in data.data.list) {
            alert(key);
            alert(json[key]);
            console.log(v);
            // var ctime_ms = timeTotimestamp(v.create_time);//消息发送时间转换为时间戳
            var options = {}
            options.target_username = data.data.list[key].from;//用户名
            options.content = data.data.list[key].msg;//消息内容
            // options.ctime_ms = ctime_ms;//消息发送时间

            if (data.data.list[key].from == from) {//发送人与本人相同，则为本人发送，靠右
              options.l_or_r = 2;//消息靠左或靠右，1：左，2：右
            }
            if (data.data.list[key].from == recipient) {//发送人与对方相同，则为对方发送，靠左
              options.l_or_r = 1;//消息靠左或靠右，1：左，2：右
            }
            var tach_list = that.data.tach_list;
            tach_list.push(options);
            that.setData({
              tach_list: tach_list
            })
            // creat_messageLi(options);//会话框内创建消息
          }	

          // $.each(data.data.list, function (i, v) {
          //   console.log(v);
          //   var ctime_ms = timeTotimestamp(v.create_time);//消息发送时间转换为时间戳
          //   var options = {}
          //   options.target_username = v.from;//用户名
          //   options.content = v.msg;//消息内容
          //   options.ctime_ms = ctime_ms;//消息发送时间

          //   if (v.from == from) {//发送人与本人相同，则为本人发送，靠右
          //     options.l_or_r = 2;//消息靠左或靠右，1：左，2：右
          //   }
          //   if (v.from == recipient) {//发送人与对方相同，则为对方发送，靠左
          //     options.l_or_r = 1;//消息靠左或靠右，1：左，2：右
          //   }
          //   creat_messageLi(options);//会话框内创建消息
          // });
        }

      });
  }


})