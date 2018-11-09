// pages/studyRoom/collection/collection.js

let examineCollectionList = require('../../../utils/config.js').examineCollectionList;
let imgUrl = require('../../../utils/config.js').imgUrl;
let ceshiUrl = require('../../../utils/config.js').ceshiUrl;
let PublicJS = require('../../../utils/require.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid: '',
    subject_type_id: '',
    type: '',
    alias: '', //别名
    page: 1,
    pagesize: 20,
    total_count: 0,
    questionList: [],
    webUrl: '',
  },

  //去练习
  goExam: function (e) {
    // let webUrl = imgUrl + 'student/wechat/html/index.html?id='+id+'&type='+type;
    console.log(e);
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let webUrl = ceshiUrl + 'wechat/html/index.html?id=' + id + '&type=' + type+'&from=4' ;
    console.log(webUrl);
    this.setData({
      webUrl: webUrl
    })
  },


  //获取题型列表
  getSubejctList() {
    let arr = [];
    arr.push('page=' + this.data.page);  //页数
    arr.push('page_size=' + this.data.pagesize);  //每页条数
    PublicJS.initData(examineCollectionList, arr, this.listresult);
  },

  //获取科目列表
  listresult: function (data) {
      // let data =  { "id": "试题或者试卷的id",
      //   "examine_name": " 试卷名称/试题名称",
      //   "type": "1 单题 2 套题 3 试卷",
      //   "create_at": "创建时间",
      //   "pace": "进度百分比 100的话显示对勾和报告 0 不显示 1 其他显示对应百分比",
      //   "report_id": "报告的id",
      //   "answer_id": "答题记录id",
      //   "pace_page": "重新开始答题的页数",
      //  }
      if(data.data == null){
        return;
      }

      let list = data.data.list;
      this.setData({
        total_count: data.data.total_count
      })
      let newSubject = this.data.questionList;

      let ex_type = this.data.type;

      list.forEach(function (value) {
        let pace = value.pace;
        let report = false;
        let jindu = false;
        let color = '';
        if (pace == 100) { //"进度百分比 100的话显示对勾和报告 0 不显示 1 其他显示对应百分比",
          report = true;
          jindu = false;
          color = 'color-C9FFE5';
        } else if (pace == 0) {
          report = false;
          jindu = false;
        } else {
          report = false;
          jindu = true;
          color = 'color-5D3367';
        }

        // console(this);
        if (ex_type == 3) {
          report = false;
          jindu = false;
        }

        let newObject = {
          id: value.id,
          type: value.type,
          name: value.examine_name,
          time: value.collection_at,
          report: report,
          jindu: jindu,
          color: color,
          pace: value.pace,
          examine_id: value.examine_id
        }
        newSubject.push(newObject)
      })
      this.setData({
        questionList: newSubject
      })
  },
  //触顶刷新
  refeshData: function () {
    this.setData({
      page: 1,
    });
    this.getSubejctList();
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
    this.getSubejctList();
  },

  //科目点击到单题
  queryItemClick: function (e) {
    var that = this;
    //拿到点击的index下标
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(id);
    console.log(index);
    //将对象转为string
    var queryBean = JSON.stringify(this.data.subjectArr[index].type);
    if (queryBean == 1 || queryBean == 2) {
      wx.navigateTo({
        url: '../subsubjects/subsubjects?type=' + queryBean + '&id=' + this.data.id,
      })
    } else {
      wx.navigateTo({
        url: '../questionsList/questionsList?type=' + queryBean + '&sid=' + this.data.id,
      })
    }
    console.log(queryBean);

  },

  //点击试题名称
  clickName: function (e) {
    var that = this;
    //拿到点击的index下标
    console.log(e);
    let index = e.currentTarget.dataset.index; //试题id
    let id = this.data.questionList[index].id;
    let type = this.data.questionList[index].type;
    console.log(id);
    // let webUrl = imgUrl + 'student/wechat/html/index.html?id='+id+'&type='+type;
    let webUrl = ceshiUrl + 'wechat/html/index.html?id=' + id + '&type=' + type;
    console.log(webUrl);
    this.setData({
      webUrl: webUrl
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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