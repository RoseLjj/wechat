// pages/courseCenter/chooseSub/chooseSub.js

const PublicJS = require('../../../utils/require.js');
const classSubjectList = require("../../../utils/config.js").classSubjectList;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [{
      name: "听力"
    }],
  },

  /**
   * 获取科目列表
   */
  getSubjectList() {
    let that = this;
    PublicJS.initData(classSubjectList, [], function(data) {
      let subjectList = data.data.list;
      let list = []
      subjectList.forEach(function(k, v) {
        let item = {
          id: k.id,
          name: k.subject_name,
          title: k.title,
          num: k.num + '人选择',
        }
        list.push(item)
      })
      that.setData({
        content: list
      })
    })
  },
  /**
   * 选择科目
   */
  choosrSubject(e) {
    let data = e.currentTarget.dataset
    console.log(data.index);
    wx.navigateTo({
      url: '../chooseSubject/chooseSubject?id=' + data.index + '&name=' + data.name,
    })
  },

  /**
   * 调查问卷
   */
  questionnaire() {
    wx.navigateTo({
      url: '../chooseType/chooseType',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getSubjectList()
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