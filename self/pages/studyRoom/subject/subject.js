// pages/subject/subject.js
var app = getApp();
var subjectList = require('../../../utils/config.js').subjectList;
var PublicJS = require('../../../utils/require.js');
let ceshiUrl = require('../../../utils/config.js').ceshiUrl;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webUrl: '', //继续答题
    questType: app.globalData.questType,
    answer_id: '',
    type: 0,
    id: '',
    current_page: 1,
    name: '',
  },

  //获取科目列表
  listresult: function(data) {
    let list = data.data.list;
    let newSubject = [];
    list.forEach(function(value) {
      let isNew = value.is_newadd == 1 ? true : false;
      let is_bestfit = value.is_bestfit == 1 ? true : false;
      let newObject = {
        id: value.id,
        name: value.subject_name,
        isNew: isNew,
        isShi: is_bestfit,
        num: value.new_examine_bumber
      }
      newSubject.push(newObject)
    })
    console.log(newSubject);
    let lastanswer = data.data.lastanswer;
    let test_name = '';
    if (lastanswer.type == 3){
      test_name = lastanswer.subject_name + '试卷' + lastanswer.name;
    }else{
      test_name = lastanswer.subject_name+(lastanswer.type == 1?'单题':'套题') + lastanswer.subject_type_name + lastanswer.name;
    }
    
    this.setData({
      subjectArr: newSubject,
      answer_id: lastanswer.answer_id,
      type: lastanswer.current_page,
      id: lastanswer.id,
      current_page: lastanswer.current_page,
      name: test_name,
    })
  },
  //获取科目列表
  getSubejctList() {
    let arr = [];
    PublicJS.initData(subjectList, arr, this.listresult);
  },

  //科目点击到单题
  queryItemClick: function(e) {
    var that = this;
    //拿到点击的index下标
    console.log(e);
    var index = e.currentTarget.dataset.index;
    console.log(index);
    //将对象转为string
    var queryBean = JSON.stringify(this.data.subjectArr[index].id);
    console.log(queryBean);
    wx.navigateTo({
      url: '../questionsType/questionsType?id=' + queryBean,
    })
  },

  //继续答题
  continueQues: function() {
    // let webUrl = imgUrl + 'student/wechat/html/index.html?id='+id+'&type='+type;
    let webUrl = ceshiUrl + 'wechat/html/index.html?id=' + this.data.id + '&type=' + this.data.type + '&answer_id=' + this.data.answer_id + '&current_page=' + this.data.current_page + '&from=1';
    this.setData({
      webUrl: webUrl
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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