// pages/courseCenter/courseList/courseList.js

const PublicJS = require('../../../utils/require.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idSubject: '',
    idChildSubject: '',
    list: [],
  },
  getClassList: function(sid, zid) {
    let classList = require('../../../utils/config.js').classList;
    let prams = ['subject_id=' + sid, 'subject_type_id=' + zid]
    let cLass = [];
    let that = this;
    PublicJS.initData(classList, prams, function(data) {
      that.setData({
        classList: data.data.list
      })
      data.data.list.forEach(function(k, v) {
        let item = {
          titleName: k.name,
          chooseTitle1: k.subject + '-' + k.subsubjects,
          chooseTitle2: '课时数量：' + k.classhour + '节',
          left: '原价：￥' + k.original_market_price,
          center: '现价：￥' + k.market_price,
          right: '优惠：￥' + k.youhui_price,
          id: k.id,
        }
        cLass.push(item)
      })
      that.setData({
        list: cLass
      })
    })
    // console.log(classList);
  },

  chosseClass: function(e) {
    let index = e.currentTarget.dataset.index;
    console.log(index)
    wx.navigateTo({
      url: '../courseCenterDetails/courseCenterDetails?id=' + index + '&idSubject=' + this.data.idSubject + '&idChildSubject=' + this.data.idChildSubject,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      idSubject: options.idSubject,
      idChildSubject: options.id
    })
    this.getClassList(options.idSubject, options.id)
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