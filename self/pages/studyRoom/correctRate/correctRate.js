// pages/correctRate/correctRate.js

var examine_report = require('../../../utils/config.js').examine_report;
var PublicJS = require('../../../utils/require.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: 0,
    number: 2,
    numArr: [],
  },


  //获取报告
  getSubejctList() {
    let arr = [];
    arr.push('id=' + this.data.id); //试题或试卷id
    PublicJS.initData(examine_report, arr, this.listresult);
  },

  //获取详情
  listresult: function(data) {
    let list = data.data.list;
    let newSubject = [];

    this.setData({
      type: list.type,
      subjectArr: newSubject
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let id = options.report_id;
    //科目id,
    this.setData({
      id: id,
    })
    this.getSubejctList()
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