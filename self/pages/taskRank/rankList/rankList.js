// pages/taskRank/rankList/rankList.js
var PublicJS = require('../../../utils/require.js');
var userRank = require('../../../utils/config.js').userRank;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonTitles: ['成绩榜', '活跃榜', "竞技榜"],
    buttonSelected: 0, //0 成绩榜  1 活跃榜  2 竞技榜
    userRankData: {}, //榜单列表
    lingjiangflage: 0,
    page: 1,
    page_size: 10,
    mReceiveList: {}
  },
  /**
   * 滚动到顶部/左边，会触发 scrolltoupper 事件
   */
  upper: function(e) {
    console.log(e)
    this.data.page = 1
    console.log("upper=" + this.data.page)
  },
  /**
   * 滚动到底部/右边，会触发 scrolltolower 事件
   */
  lower: function(e) {
    console.log(e)
    this.data.page = this.data.page + 1
    console.log("lower=" + this.data.page)
  },
  // 顶部模块按钮切换
  buttonChange: function(e) {
    var index = parseInt(e.currentTarget.id);
    if (index == this.data.buttonSelected) {
      return;
    }
    this.setData({
      buttonSelected: index
    });
    this.getUserRank();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserRank();
  },
  //获取任务列表 
  getUserRank: function() {
    var arr = [];
    arr.push("type=" + (this.data.buttonSelected + 1)); //1 成绩榜 2 活跃榜 3 竞技榜
    arr.push("ctype=" + "1"); // 1 全区 2 好友
    arr.push("page=" + "" + this.data.page);
    arr.push("page_size=" + "" + this.data.page_size);
    PublicJS.initData(userRank, arr, this.userRankCallBack);
  },
  // 任务列表数据
  userRankCallBack: function(data) {
    console.log(data);

    if (data.errorCode == 0) {
      this.setData({
        userRankData: data.data,
        lingjiangflage: data.data.is_receive,
        mReceiveList: data.data.receive_list
      })
    }
  },
  //领奖
  lingjiangClick: function(e) {
    console.log("==================" + this.data.mReceiveList.reward_id)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})