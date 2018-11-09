// pages/friends/friends.js
let imgUrl = require('../../utils/config.js').imgUrl;
let fileBaseUrl = require('../../utils/config.js').fileBaseUrl;
let game_user_rank = require('../../utils/config.js').game_user_rank;
let my_prop_list = require('../../utils/config.js').my_prop_list;
let game_begin_pick = require('../../utils/config.js').game_begin_pick;
let PublicJS = require('../../utils/require.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    page:1,
    pagesize:20,
    total_count:0,
    btnType:0,//匹配的类型 1:微信好友,2:随机
    sex: 2,
    cloverNumber: '12123321', //四叶草总数
    rank:3,
    showModal:false,
    propArr:[
      {
        img:'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png',
        num: 3,
        money: 200,
      },
      {
        img: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png',
        num: 3,
        money: 200,
      },
      {
        img: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png',
        num: 3,
        money: 200,
      },
      {
        img: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png',
        num: 3,
        money: 200,
      }
    ],
    friendsArr:[
      {
        portrait: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png', //头像
        name:'飞翔的荷兰', //名称
        label:'勤学苦练', //标签
        jifen:30584, //积分
        win: 20, //战胜人数
        rank:1,
      },
      {
        portrait: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png', //头像
        name: '飞翔的荷兰', //名称
        label: '勤学苦练', //标签
        jifen: 3084, //积分
        win: 20, //战胜人数
        rank: 2,
      },
      {
        portrait: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png', //头像
        name: '飞翔的荷兰', //名称
        label: '勤学苦练', //标签
        jifen: 3054, //积分
        win: 20, //战胜人数
        rank: 3,
      },
      {
        portrait: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png', //头像
        name: '飞翔的荷兰', //名称
        label: '勤学苦练', //标签
        jifen: 30584, //积分
        win: 20, //战胜人数
        rank: 4,
      },
      {
        portrait: 'http://student.ryit.co/student/wechat/image/pk/shengyin@3x.png', //头像
        name: '飞翔的荷兰', //名称
        label: '勤学苦练', //标签
        jifen: 30584, //积分
        win: 20, //战胜人数
        rank: 5,
      },
    ],
    showModal2:true,
  },

  //获取排行榜
  getRankList: function () {
    let params = [];
    params.push('page=' + this.data.page);
    params.push('page_size=' + this.data.pagesize);
    params.push('id=' + this.data.id);
    PublicJS.initData(game_user_rank, params, this.renderRankList)
  },

  //渲染排行榜
  renderRankList(data) {
    let info = data.data;
    let list = data.data.list;

    let gameList = [];
    list.forEach(function (value) {
      let gameOne = {
        id: value.game_id,
        portrait: value.headimgurl, //头像
        name: value.game_name, //名称
        label: value.title, //标签
        jifen: value.honor_score  || 0, //积分
        win: value.beat_people || 0, //战胜人数
        rank: value.rank,
      }
      gameList.push(gameOne);
    })
    this.setData({
      friendsArr: gameList,
      total_count: info.total_count,
    })
  },

  //触底加载数据
  addData: function () {
    let total_count = this.data.total_count;
    let pagesize = this.data.pagesize;
    let total_page = Math.ceil(total_count / pagesize);
    if (total_page == this.data.page) {
      return;
    }
    this.setData({
      page: this.data.page + 1,
    });
    this.getRankList();
  },

  //获取我的道具
  getMyPropList: function () {
    let params = [];
    params.push('page=' + this.data.page);
    params.push('page_size=' + this.data.pagesize);
    params.push('id=' + this.data.id);
    PublicJS.initData(my_prop_list, params, this.renderMyPropList)
  },

  //渲染排行榜
  renderMyPropList(data) {
    let info = data.data;
    let list = data.data.list;

    let gameList = [];
    list.forEach(function (value) {
      let gameOne = {
        id: value.game_id,
        img: fileBaseUrl+value.img,
        num: value.number,
        limit_number: value.limit_number,
        money: value.clover_number,
      }
      gameList.push(gameOne);
    })
    this.setData({
      propArr: gameList,
    })
  },

/**
 * 购买道具
 */
  addProp(e){
    let index = e.currentTarget.dataset.index; //1微信好友PK,2随机匹配
    let propArr = this.data.propArr;
    propArr[index].num = parseInt(propArr[index].num)+1;
    this.setData({
      propArr: propArr,
    })
  },


/**
 * 打开道具弹框
 */
  openPropBox(e){
    let type = e.currentTarget.dataset.type; //1微信好友PK,2随机匹配
    this.setData({
      showModal:true,
      btnType:type,
    })
  },

/**
 * 开始匹配
 */
  startMatch(){
    let newProp = [];
    let propArr = this.data.propArr;
    propArr.forEach(function(value){
      let propObj = {
        prop_id:value.id,
        number:value.num,
      }
      newProp.push(propObj)
    })
    let params = [];
    params.push('id='+this.data.id);
    params.push('type=' + this.data.btnType);
    params.push('prop_object=' + JSON.stringify(newProp));
    PublicJS.initData(game_begin_pick,params,this.matchSuccess)
  },

/**
 * 匹配结果
 */
  matchSuccess(){

  },
  /**
 * 关闭道具弹框
 */
  closePropBox(e) {
    let type = e.currentTarget.dataset.type; //1微信好友PK,2随机匹配
    this.setData({
      showModal: false,
    })
  },

  openWaitFor(){
    this.setData({
      showModal2:true,
    })
  },

  openWaitFor() {
    this.setData({
      showModal2: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    this.setData({
      id:id,
      bgcImg: app.globalData.bgcImg
    })
    this.getRankList();
    this.getMyPropList();
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