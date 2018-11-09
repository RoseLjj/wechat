// pages/courseCenter/chooseType/chooseType.js
var app = getApp();
//问卷调查saveInvestigation
var investigationList = require('../../../utils/config.js').investigationList;
var saveInvestigation = require('../../../utils/config.js').saveInvestigation;
var PublicJS = require('../../../utils/require.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textTitle: "您好，为了节省您的时间，方便我们为您提供更精准的服务，请回答以下问题～",
    contentList: [],
    titleTypeName: "您的学历是？",
    steps: 0,
    stepsNum: 0,
    courseTypeList: ["高中", "本科", "研究生", "博士", "其他"],
    answerList: [],
    buttonSelectIndex: [],
    buttonSelectDanxuanIndex: -1,
    xuanzheType: 1, //0单选  1多选
  },
  //页面初始化
  initPage: function() {
    let item = this.data.contentList[this.data.steps];
    let name = item.name;
    let course = [];
    let buttonSelect = [];
    item.list.forEach(function(k, v) {
      course.push(k.name);
      buttonSelect.push(false);
    })
    this.setData({
      courseTypeList: course,
      titleTypeName: name,
      buttonSelectIndex: buttonSelect,
      buttonSelectDanxuanIndex: -1,
      xuanzheType: item.isselection
    })
  },
  numChange(e) {
    let numi = e.detail;
    numi = numi < 0 ? 0 : numi;
    this.setData({
      steps: numi
    })
    this.initPage()
    console.log(numi)
  },
  //问卷调查
  getInvestigationList: function() {
    let that = this;
    let arr = [];
    PublicJS.initData(investigationList, arr, function(data) {
      let list = data.data.list;
      let item = list[0];
      let name = item.name;
      let course = [];
      let buttonSelect = [];
      item.list.forEach(function(k, v) {
        course.push(k.name);
        buttonSelect.push(false);
      })
      that.setData({
        stepsNum: list.length,
        contentList: list,
        courseTypeList: course,
        titleTypeName: name,
        steps: 0,
        buttonSelectIndex: buttonSelect,
        buttonSelectDanxuanIndex: -1,
        xuanzheType: item.isselection
      })
    });
  },
  // 选择课程
  courseTypeAction: function(e) {
    let index = e.currentTarget.dataset.index;
    let steps = this.data.steps;
    if (this.data.xuanzheType == 1) { //单选
      //存储答案
      let answer = {
        steps: steps,
        index: [index],
      }
      this.data.answerList[this.data.steps] = answer;
      //步骤++
      steps++;
      //最后一步  提交
      if (steps >= this.data.stepsNum) {
        this.setAnswer()
        // console.log(this.data.answerList)
      } else {
        // 修改数据
        this.setData({
          steps: steps,
          buttonSelectDanxuanIndex: index,
        })
        this.initPage()
      }
    } else { //多选
      var list = this.data.buttonSelectIndex;
      if (list[index]) {
        list.splice(index, 1, false);
      } else {
        list.splice(index, 1, true);
      }
      this.setData({
        buttonSelectIndex: list
      })
    }

    // console.log(index);
    // console.log(this.data.xuanzheType);
  },
  //下一步
  nextAction: function() {
    console.log(this.data.buttonSelectIndex);
    let buttonSelect = this.data.buttonSelectIndex;
    let steps = this.data.steps;
    let list = []
    console.log(buttonSelect)
    buttonSelect.forEach(function(k, v) {
      if (k) {
        list.push(v);
      }
    })
    //提交
    if (steps >= this.data.stepsNum) {

    } else {
      console.log(list);
      let answer = {
        steps: steps,
        index: list,
      }
      this.data.answerList[this.data.steps] = answer;
      steps++;
      this.setData({
        steps: steps,
      })
      this.initPage()
    }
  },
  //处理答案
  handleAnswer: function() {
    let content = this.data.contentList;
    let answerList = this.data.answerList;
    let list = [];
    content.forEach(function(k, v) {
      let answer = []
      answerList[v].index.forEach(function(kk, vv) {
        answer.push(k.list[kk].id)
      })
      answer = answer.join(',')
      let item = {
        questionid: k.id,
        questionitem: answer,
      }
      list.push(item)
    })
    return list;
  },
  //保存问卷
  setAnswer: function() {
    let questionitem = this.handleAnswer()
    questionitem = JSON.stringify(questionitem)
    let prams = ['questionitem=' + questionitem]
    console.log(prams)
    PublicJS.initData(saveInvestigation, prams, function(data) {
      console.log(data)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getInvestigationList()
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
    console.log('onUnload')
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