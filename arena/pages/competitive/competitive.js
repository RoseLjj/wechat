// pages/competitive/competitive.js
let imgUrl = require('../../utils/config.js').imgUrl;
let fileBaseUrl = require('../../utils/config.js').fileBaseUrl;
let game_list = require('../../utils/config.js').game_list;
let PublicJS = require('../../utils/require.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloverNumber: '12,123,321',
    page: 1,
    pagesize: 10,
    gameList: [{
      name: '长长长长颈鹿',
      people: 123,
      lable: '谁! 怕! 谁!',
      img: '',
    }],
    nickname: "",  //昵称
    rank: 1, //我的排名
    head_avatar: "", //头像
    user_title: "", //我的称号
    honor_score: "", //我的荣耀积分
    sex: "", //性别
    total_count: "",
    beat_people:0,//打败多少人
  },

  getGameList: function() {
    let params = [];
    params.push('page=' + this.data.page);
    params.push('page_size=' + this.data.pagesize);
    PublicJS.initData(game_list, params, this.renderGameList)
  },

  renderGameList(data) {
    let info = data.data;
    let list = data.data.list;

    let gameList = [];
    list.forEach(function(value) {
      let gameOne = {
        name: value.game_name,
        people: value.play_number,
        lable: value.description,
        img: fileBaseUrl+value.game_cover,
        id: value.id,
      }
      gameList.push(gameOne);
    })
    this.setData({
      gameList: gameList,
      total_count: info.total_count,
      nickname: info.total_count,  
      rank: info.rank, 
      head_avatar: info.head_avatar,
      user_title: info.user_title, 
      honor_score: info.honor_score, 
      sex: info.sex, 
      beat_people: info.beat_people,
    })
  },

/**
 * 去游戏排行榜
 */
  goUserRank(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let id = this.data.gameList[index].id;
    wx.navigateTo({
      url: '../friends/friends?id='+id ,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bgcImg: app.globalData.bgcImg
    })
    this.getGameList();
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