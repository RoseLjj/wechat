// pages/courseCenter/courseCenterDetails/courseCenterDetails.js
const PublicJS = require('../../../utils/require.js');
const classInfo = require('../../../utils/config.js').classInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listShow: true,
    courseTitleName: "课程名称标题",
    imagejiantou: "../../../image/icon/jtxia2@2x.png",
    list: ["", "", "", "", "",],
    classList: [],
    course: {
      id: '',
      name: "雅思",
      type: '1v1',
      numberClass: '5节',
      typeClass: '面授',
      introduction: "课程简介",
      price: '100.00',
      left: '原价：￥100.00',
      center: '现价：￥10.00',
      right: '优惠：￥10.00',
    }
  },
  /**
   * 获取课程列表
   */
  getClassList: function (sid,cid) {
    let classList = require('../../../utils/config.js').classList;
    let prams = ['subject_id=' + sid,'subject_type_id='+cid]
    let cLass = [];
    let that = this;
    PublicJS.initData(classList, prams, function (data) {
      that.setData({
        classList: data.data.list
      })
      data.data.list.forEach(function (k, v) {
          let item = {
          titleName: k.name,
          chooseTitle1: k.subject + '-' + k.subsubjects,
          chooseTitle2: '课时数量：' + k.classhour + '节',
          left: '原价：￥' + k.original_market_price,
          center: '现价：￥' + k.market_price,
          right: '优惠￥：' + k.youhui_price,
          id: k.id,
        }
        cLass.push(item)
      })
      that.setData({
        list: cLass
      })
    })

  },
  /**
   * 获取课程详情
   */
  showDetalis: function (id) {
    let that=this;
    let prams = ['classid='+id]
    PublicJS.initData(classInfo,prams,function(data){
      let item=data.data.list;
      let nowItem = {
        id: item.id,
        name: item.name,
        type: (item.property == 1 ? '小班课' :"1v1"),
        numberClass: item.class_hour + '节',
        typeClass: (item.is_mianshou == 1 ? '面授' :'网授'),
        introduction: item.summary,
        price: item.market_price,
        left: '原价：￥' + item.original_market_price,
        center: '现价：￥' + item.market_price,
        right: '优惠：￥' + item.youhui_price,
      }
      that.setData({
        course: nowItem,
        listShow: true,
        courseTitleName: item.name,
      })
    })
  },
  showList: function () {
    // this.setData({ listShow: !this.data.listShow });
    if (this.data.listShow) {
      this.setData({
        listShow: false
      })
    } else {
      this.setData({
        listShow: true
      })
    }

  },
  /**
   * 选择课程
   */
  chooseClass(e){
    let data = e.currentTarget.dataset;
    this.showDetalis(data.index)
  },
  /**
   * 调查问卷
   */
  questionnaire(){
    wx.navigateTo({
      url: '../chooseType/chooseType',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('-------------获取参数------------',options)
    let id = options.id
    this.getClassList(options.idSubject, options.idChildSubject)
    this.showDetalis(id)
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