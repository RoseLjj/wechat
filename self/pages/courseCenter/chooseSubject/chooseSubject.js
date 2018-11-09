// pages/courseCenter/chooseSubject/chooseSubject.js


const PublicJS = require('../../../utils/require.js');
const classSubjectTypeList = require("../../../utils/config.js").classSubjectTypeList;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    idSubject: '',
    chooseSubject: [{
      id: "-1",
      name: "其他"
    }],
  },

  getSubject(id) {
    let that = this;
    PublicJS.initData(classSubjectTypeList, ['id=' + id], function(data) {
      let subjectList = data.data.list;
      let list = []
      subjectList.forEach(function(k, v) {
        let item = {
          id: k.id,
          name: k.subject_name,
          alias_name: k.alias_name,

        }
        list.push(item)
      })
      list.push({
        id: -1,
        name: '其他',
        alias_name: '',
      })
      that.setData({
        chooseSubject: list
      })
    })
  },

  /**
   * 选择子科目
   */
  chooseSubjectAction: function(e) {
    let data = e.currentTarget.dataset;
    console.log(data);
    wx.navigateTo({
      url: '../courseList/courseList?id=' + data.index + '&idSubject=' + this.data.idSubject,
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      idSubject: options.id,
    })
    this.getSubject(options.id)
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