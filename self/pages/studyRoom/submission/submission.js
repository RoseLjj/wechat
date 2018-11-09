// pages/studyRoom/submission/submission.js
let examine_report = require('../../../utils/config.js').examine_report;
let examine_question_no = require('../../../utils/config.js').examine_question_no;
let examine_correct_record = require('../../../utils/config.js').examine_correct_record; //批改记录
let apply_correct_two = require('../../../utils/config.js').apply_correct_two; //申请批改
let fileBaseUrl = require('../../../utils/config.js').fileBaseUrl; //文件域名
let ceshiUrl = require('../../../utils/config.js').ceshiUrl;
let PublicJS = require('../../../utils/require.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    modalMeesage: '您提交的批改申请反馈可能会不及时，具体请以系统通知为准！',
    modalConfirm: '确认',
    modalCancel: '取消',
    modalType: 1,

    showRecordModal: false,
    record_marginTop: '-200rpx',
    recordArr: [],

    goUrl: '',
    is_show_exceed: 0,
    test_name: '',
    answer_time: '00:00:00',
    isTest: false,
    subject_name: '',
    subject_type_id: '', //子科目id
    subject_type_name: '',
    isHaveTime: false, //非口语和写作
    is_reading: 0, //是否申请批改 0 未申请 1 为批改 2 已批改
    test_id: '',
    answer_rate: 0,
    exceed_rate: 0,
    type: 0,
    answer_id: '',
    total_score: 0,
    numArr: [],
    subject_sort: 0, //子科目次序用于试卷的题号切换
    subject_num: 0, //子科目个数
    isLeft: false,
    isRight: false,
    numberData: '',
    kemu: '',
    isLeft: false,
    isRight: false,
    is_apply: false, //是否需要申请批改
    speak_id: '', //口语录音申请id
    write_id: '', //写作申请id
    isKemu: false, //雅思,托福试卷才有综合评分
    isGMATGRE: false, //是否是GMAT,GRE

  },


  //获取报告
  getReportInfo() {
    let arr = [];
    arr.push('id=' + this.data.report_id); //试题报告的id
    arr.push('subject_type_id=' + this.data.subject_type_id); //试题报告的id
    PublicJS.initData(examine_report, arr, this.renderReport);
  },

  //渲染头部
  renderReport: function(data) {
    let list = data.data.list;
    let answer_time = PublicJS.secToTime(list.answer_time);
    let isKemu = (list.subject_name == 'IELTS' || list.subject_name == 'TOEFL') ? true : false;
    let isGMATGRE = (list.subject_name == 'GMAT' || list.subject_name == 'GRE') ? true : false;
    let isStatus = 0;
    if (this.data.subject_type_name == '口语' || this.data.subject_type_name == '写作') {
      isStatus = 2; //显示时间
    } else {
      if (list.type == 3) { //试卷
        if (isGMATGRE) {
          isStatus = 3; //显示答对个数
        } else {
          isStatus = 1; //显示得分
        }
      } else { //单题,套题
        isStatus = 3; //显示答对个数
      }
    }

    this.setData({
      speak_id: list.speak_id,
      write_id: list.write_id,
      test_id: list.testpaper_id,
      type: list.type,
      answer_id: list.answer_id,
      subject_name: list.subject_name,
      is_reading: list.is_reading,
      total_score: list.total_score, //"总得分
      test_name: list.name, //试卷名称/试题名称
      answer_time: answer_time, //"用时单位秒
      answer_rate: list.answer_rate, //"正确率
      exceed_rate: list.exceed_rate, // "超过人数百分比"
      is_show_exceed: list.is_show_exceed, //是否显示超过人数百分比 1 显示 0 不显示",
      isKemu: isKemu,
      isGMATGRE: isGMATGRE,
      true_number: list.true_number,
      isStatus: isStatus,
    })
    console.log(this.data.isHaveTime + '--' + this.data.is_reading)
    if (list.type != 3) {
      this.setData({
        isTest: false,
      })
    } else {
      this.setData({
        isTest: true,
      })
    }
  },

  //获取题号
  getQuestionNo() {
    console.log(this.data.type);
    let arr = [];
    arr.push('id=' + this.data.test_id); //试题或试卷id
    arr.push('type=' + this.data.type); //	1 单题 2 套题 3 试卷
    arr.push('answer_id=' + this.data.answer_id); //	答题记录id
    PublicJS.initData(examine_question_no, arr, this.renderNumber);
  },

  //重新练习
  goRepractice: function() {
    let studentUrl = ceshiUrl + 'wechat/html/index.html?id=' + this.data.test_id + '&type=' + this.data.type + '&report_id' + this.data.report_id + '&a_id=' + this.data.answer_id + '&from=3';
    this.setData({
      goUrl: studentUrl,
    })
  },

  //查看解析
  goAnalysis: function() {
    let studentUrl = ceshiUrl + 'wechat/html/analysis.html?id=' + this.data.test_id + '&type=' + this.data.type + '&answer_id=' + this.data.answer_id + '&report_id=' + this.data.report_id;
    console.log(studentUrl);
    this.setData({
      goUrl: studentUrl,
    })
  },

  /**
   * 渲染题号
   */
  renderNumber: function(data) {
    let list = data.data.list[this.data.subject_sort].question;
    let newSubject = [];
    list.forEach(function(value) {
      let isRight = true;
      let bgc = '';
      //0 未答 1 正确 2 错误 3 已答
      if (value.state == 1) {
        isRight = true;
        bgc = 'bgc-1ADAAF';
      } else {
        isRight = false;
        bgc = 'bgc-FF7474';
      }
      let newObject = {
        num: value.no,
        isRight: isRight,
        bgc: bgc,
      }
      newSubject.push(newObject)

    })
    let kemu = data.data.list[this.data.subject_sort].subject_type_name;
    console.log(kemu + '000');
    let subject_type_id = data.data.list[this.data.subject_sort].subject_type_id;
    let isHaveTime = (kemu != "口语" && kemu != "写作");
    this.setData({
      numArr: newSubject,
      subject_num: data.data.list.length,
      numberData: data,
      kemu: kemu,
      isHaveTime: isHaveTime,
      subject_type_name: kemu,
      subject_type_id: subject_type_id,
    })

    let isLeft = false;
    let isRight = false;
    if (this.data.subject_sort < this.data.subject_num - 1) { //有右边了
      isRight = true;
    }

    if (this.data.subject_sort > 0) { //有左边了
      isLeft = true;
    }

    this.setData({
      isLeft: isLeft,
      isRight: isRight,
    })
    this.getReportInfo();
  },

  //申请
  shenQing: function() {
    this.setData({
      showModal: true,
    })
    this.modal.modalCallback = this.applayQue;
  },

  /**
   * 申请批改
   */
  applayQue: function() {
    let params = [];

    params.push('answer_id=' + this.data.answer_id);
    params.push('type=' + this.data.type);
    params.push('apply_name='); //申请学员的姓名
    params.push('apply_mobile='); //申请学员的手机号
    params.push('intent_subject_id='); //申请学员的意向科目id 多选用,连接
    params.push('science_type=1');
    params.push('subject_type_id=' + this.data.subject_type_id);
    if (this.data.subject_type_name == '口语') {
      params.push('item_id=' + this.data.speak_id);
    } else if (this.data.subject_type_name == '写作') {
      params.push('item_id=' + this.data.write_id);
    }
    PublicJS.initData(apply_correct_two, params, this.renderApplay)
  },

  renderApplay: function(data) {
    this.setData({
      showModal: false,
      is_reading: 1,
    })
  },

  goZonghe: function() {
    wx.navigateTo({
      url: '../composite/composite?report_id=' + this.data.report_id,
    })
  },

  //批改记录
  getCorrectRecord(e) {
    let params = ['answer_id=' + this.data.answer_id];
    let subject_type_name = this.data.subject_type_name;
    params.push('subject_type_name=' + subject_type_name);
    let that = this;
    PublicJS.initData(examine_correct_record, params, function(data) {
      that.renderRecord(data, subject_type_name)
    })
  },
  //批改记录
  renderRecord(data, subject_type_name) {
    console.log(subject_type_name);
    let list = data.data.list;
    if (subject_type_name == '写作') { //就是图片

      let imgArr = [];
      list.forEach(function(value) {
        if (value.audio_file) {
          imgArr.push(value.audio_file);
        }
      })
      wx.previewImage({
        current: imgArr[0], // 当前显示图片的http链接
        urls: imgArr // 需要预览的图片http链接列表
      })
    } else {
      let recordArr = [];
      list.forEach(function(value) {
        let recordObj = {};
        if (value.audio_file) {
          recordObj.audio_file = fileBaseUrl + value.audio_file;
          recordObj.audio_tname = value.audio_tname;
          recordObj.img2 = '';
          recordObj.time = '';
          recordObj.is_audio = value.audio_file.split('.')[1] == 'mp3' ? true : false;
        }
        recordArr.push(recordObj);
      })
      console.log(recordArr);
      this.setData({
        recordArr: recordArr,
        showRecordModal: true,
      })

    }
  },

  /**
   * 点击左侧按钮
   */
  clickLeft: function() {
    this.fanSubject(2)
  },
  /**
   * 点击右侧按钮
   */
  clickRight: function() {
    this.fanSubject(1)
  },

  /**
   * 左右切换子科目
   */
  fanSubject: function(type) {
    let subject_sort;
    if (type == 1) {
      subject_sort = this.data.subject_sort + 1;
    } else {
      subject_sort = this.data.subject_sort - 1;
    }
    this.setData({
      subject_sort: subject_sort,
    })
    let isLeft = this;
    let isRight = false;
    if (this.data.subject_sort < this.data.subject_num - 1) { //有右边了
      isRight = true;
    }

    if (this.data.subject_sort > 0) { //有左边了
      isLeft = true;
    }

    this.setData({
      isLeft: isLeft,
      isRight: isRight,
    })
    this.renderNumber(this.data.numberData);
  },

  // 分享
  onShareAppMessage: function(res) {
    if(res.form == 'button'){
      console.log('1111')
    }
    let that = this;
    let url = currentPage.route //当前页面url
    console.log(url);
    return {
      title: '简直走别拐弯', // 转发后 所显示的title
      // path: '/pages/submission/submission', // 相对的路径
      success: (res) => { // 成功后要做的事情
        if (res.errMsg == 'shareAppMessage:ok') {　}

      },
      fail: function(res) {
        // 分享失败
        console.log(res)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let report_id = options.report_id;
    let test_id = options.id;
    let type = options.type;
    let answer_id = options.answer_id;
    //科目id,
    this.setData({
      report_id: report_id,
      test_id: test_id,
      type: type,
      answer_id: answer_id,
    })
    this.getQuestionNo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.modal = this.selectComponent('#modal');
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