// pages/win/win.js
let game_over_list = require('../../utils/config.js').game_over_list;
let PublicJS = require('../../utils/require.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloverNumber: '123,321',
    isWin: false,
    winner_portrait: '', //胜者头像
    winner_name: 'simon', //胜者名称
    winner_num:6, //胜者答对个数
    winner_fen:100,//胜者得分
    winner_isMe:true, //胜者是我吗
    loser_portrait: '', //败者头像
    loser_name: '小李', //败者名称
    loser_num: 5, //败者答对个数
    loser_fen: 90,//败者得分
    extra_active_score:300,//胜利者额外的活跃点
    extra_honor_score: 1000,//胜利者额外的荣誉积分
  },


  getGameInfo: function () {
    let params = [];
    params.push('pk_number=' + this.data.pk_number);
    PublicJS.initData(game_over_list, params, this.renderGameInfo)
  },

  renderGameInfo(data) {
    let info = data.data;

    info.forEach(function (value) {
      if (value.is_win ==1){
        this.setData({
          winner_portrait: value.avatar, 
          winner_name: value.nickname,
          winner_num: value.right_number, 
          winner_fen: value.score,
          winner_isMe: value.is_me == 1?true:false, 
        })
      }else{
        this.setData({
          loser_portrait: value.avatar,
          loser_name: value.nickname,
          loser_num: value.right_number,
          loser_fen: value.score,
        })
      }
      if(value.is_me ==1){
        this.setData({
          extra_active_score: value.extra_active_score,//胜利者额外的活跃点
          extra_honor_score: value.extra_honor_score,//胜利者额外的荣誉积分
        })
      }
    })
  
  },

/**
 * 分享
 */
  onShareAppMessage() {
    return {
      title: '弹出分享时显示的分享标题',
      desc: '分享页面的内容',
      path: '/pages/share/share?id=123' // 路径，传递参数到指定页面。
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pk_number = options.pk_number;
    this.setData({
      bgcImg: app.globalData.bgcImg,
      pk_number: pk_number,
    })
    // this.getGameInfo();
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