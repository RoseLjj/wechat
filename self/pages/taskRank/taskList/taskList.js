// pages/taskRank/taskList/taskList.js
var smallprogramTaskList = require('../../../utils/config.js').smallprogramTaskList;
var receiveSmallprogramTask = require('../../../utils/config.js').receiveSmallprogramTask;
var PublicJS = require('../../../utils/require.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonTitles: ['登录','日常'],//任务模块
    buttonSelected: 1,//1 登录任务  2 日常任务
    taskList: [],//任务列表
    showPrize: false,//是否显示奖励提示框
    showPrizeContent: '获取金币 20',//奖励提示框内容
  },
  
  // 顶部模块按钮切换
  buttonChange: function (e) {
    var index = parseInt(e.currentTarget.id)+1;
    if (index == this.data.buttonSelected) {
      return;
    }
    this.setData({
      buttonSelected: index
    });
    this.getTaskList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskList();
  },
  //获取任务列表 
  getTaskList: function () {
    var arr = [];
    arr.push("type=" + this.data.buttonSelected);
    PublicJS.initData(smallprogramTaskList, arr, this.taskList);
  },
  // 任务列表数据
  taskList: function (data) {
    console.log(data);
    if (data.errorCode == 0) {
      this.setData({
        taskList: data.data.list
      })
    }
  },
  // 领取奖品
  receivePrize: function (e) {
    var that = this;
    var index = e.currentTarget.id;
    var item = this.data.taskList[index];
    if (item.isget == 1) {//未领取
      var arr = [];
      arr.push("taskid="+item.id);
      PublicJS.initData(receiveSmallprogramTask, arr, function (data) {
        if (data.errorCode == 0) {
          that.setData({
            showPrize: true,
            showPrizeContent: '获取钻石 '+item.d_number,
          });
          setTimeout(function () {
            console.log("延迟调用============")
            that.setData({
              showPrize: false,
            });
            that.getTaskList();
          }, 2000)
        }
      });
    }
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

  }
})