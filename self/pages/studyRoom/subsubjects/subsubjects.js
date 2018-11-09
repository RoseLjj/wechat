// pages/subsubjects/subsubjects.js
let zikemuList = require('../../../utils/config.js').zikemuList;
let PublicJS = require('../../../utils/require.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type:1,
    isHuo: false, //活跃点
    subjectArr: []
  },


  //获取题型列表
  getSubejctList() {
    let arr = ['id=' + this.data.id,'type='+this.data.type];
    PublicJS.initData(zikemuList, arr, this.listresult);
  },

  //获取科目列表
  listresult: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    if (data.errorCode == 0) {
      let list = data.data.list;
      let newSubject = [];
      list.forEach(function (value) {
        let isNew = value.is_newadd == 1 ? true : false;
        let is_bestfit = value.is_bestfit ? true : false;
        let name = value.alias_name ? value.alias_name : value.subject_name;
        let newObject = {
          id: value.id,
          name: value.subject_name,
          alias_name: value.alias_name
        }
        newSubject.push(newObject)
      })
      this.setData({
        subjectArr: newSubject
      });
    } else {
      console.log(data.errorMessage);
    }
  },

  //科目点击到单题
  queryItemClick: function (e) {
    var that = this;
    //拿到点击的index下标
    console.log(e);
    let alias = e.currentTarget.dataset.alias;
    let stid = e.currentTarget.dataset.id;
    //将对象转为string
    if (this.data.type == 1 || this.data.type == 2) {
      wx.navigateTo({
        url: '../questionsList/questionsList?type=' + this.data.type + '&sid=' + this.data.id + '&stid=' + stid + '&alias=' + alias,
      })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(options.id);
    let id = options.id;
    let type = options.type;
    this.setData({
      id: id,
      type:type,
    })
    this.getSubejctList()
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