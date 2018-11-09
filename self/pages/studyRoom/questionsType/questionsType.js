// pages/quesionsType/questionsType.js
var examineType = require('../../../utils/config.js').examineType;
var PublicJS = require('../../../utils/require.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subjectArr: [],
    isHuo:false,
  },

  //获取题型列表
  getSubejctList() {
    let arr = ['id='+this.data.id];
    PublicJS.initData(examineType, arr, this.listresult);
  },

  //获取科目列表
  listresult: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    if (data.errorCode == 0) {
      let list = data.data.list;
      let newSubject = [];
      list.forEach(function (value) {
        let type = 1;
        if(value.name == '单题'){
          type = 1;
        } else if (value.name == '套题') {
          type = 2;
        } else if (value.name == '试卷') {
          type = 3;
        }
        let newObject = {
          name: value.name,
          type:type,
        }
        newSubject.push(newObject)
      })
      this.setData({
        subjectArr: newSubject
      })
    } else {
      console.log(data.errorMessage);
    }
  },

  //科目点击到单题
  queryItemClick: function (e) {
    var that = this;
    //拿到点击的index下标
    console.log(e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    //将对象转为string
    var queryBean = JSON.stringify(this.data.subjectArr[index].type);
    if (queryBean == 1 || queryBean == 2){
      wx.navigateTo({
        url: '../subsubjects/subsubjects?type=' + queryBean+'&id='+this.data.id,
      })
    }else{
      wx.navigateTo({
        url: '../questionsList/questionsList?type=' + queryBean + '&sid=' + this.data.id,
      })
    }
    console.log(queryBean);
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
      let id = JSON.parse(options.id);
      //科目id,
      this.setData({
        id: id
      })
    this.getSubejctList()
      //console.log(that.data.queryBean)
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