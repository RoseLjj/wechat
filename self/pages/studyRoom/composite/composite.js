// pages/studyRoom/composite/composite.js
let comprehensive_score = require('../../../utils/config.js').comprehensive_score;
let examine_target_fraction = require('../../../utils/config.js').examine_target_fraction
let apply_correct_two = require('../../../utils/config.js').apply_correct_two; //申请批改
let examine_correct_record = require('../../../utils/config.js').examine_correct_record; //批改记录
let fileBaseUrl = require('../../../utils/config.js').fileBaseUrl; //文件域名
let PublicJS = require('../../../utils/require.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal2: false,
    imgStr: ['student/wechat/image/assets/tishi@3x.png', 'student/wechat/image/assets/guanbi@3x.png'],
    bgcImg: [],
    marginTop: '-250rpx',

    showRecordModal: false,
    recordArr: [],

    showModal: false,
    modalMeesage: '您提交的批改申请反馈可能会不及时，具体请以系统通知为准！',
    modalConfirm: '一键申请',
    modalCancel: '',
    modalType: 1,

    score: 50,
    zongheping: 0, //综合评分
    target_score: 0,
    target_country: '', //目标国家
    comprehensive_score: [{
        subject_type_name: '口语',
        score: 0,
        correct_id: '', //"需批改的id， 口语，写作使用"
        is_apply: 1, //0 未批改 1 申请 2 已批改,  4得分
      },
      {
        subject_type_name: '阅读',
        score: 0,
        correct_id: '', //"需批改的id， 口语，写作使用"
        is_apply: 4, //0 未批改 1 申请 2 已批改,  4得分
      },
    ],
    target_score: [{
      subject_type_name: 'ietls-阅读',
      score: 50,
    }],
    tk_data: {
      "subject_id": "Tpw8XA2E16QNDg",
      "subject_name": "IELTS",
      "score": "",
      "subject_type": [{
        "subject_type_id": "TM80W13Z16AIDZY",
        "subject_type_name": "口语",
        "score": "20"
      }]
    },
    isSuccess: false,
  },
  //修改科目
  kemuInput(e) {
    let value = e.detail.value;
    let tk_data = this.data.tk_data;
    tk_data.score = value;
    this.setData({
      tk_data: tk_data,
    })
    console.log(this.data.tk_data)
  },
  //修改子科目
  zikeInput(e) {
    let value = e.detail.value;
    let tk_data = this.data.tk_data;
    let index = e.currentTarget.dataset.index;
    tk_data.subject_type[index].score = value;
    this.setData({
      tk_data: tk_data,
    })
    console.log(this.data.tk_data)
  },
  getBackground() {
    let imgUrl = app.data.imgUrl;
    let bgcImg = [];
    this.data.imgStr.forEach(function(value) {
      bgcImg.push(imgUrl + value);
    })
    this.setData({
      bgcImg: bgcImg,
    })
  },
  //获取数据
  getComprehensive() {
    let arr = [];
    arr.push('report_id=' + this.data.id); //试题或试卷id
    PublicJS.initData(comprehensive_score, arr, this.renderComprehensive);
  },

  //渲染页面
  renderComprehensive(data) {
    let list = data.data.list;
    console.log(list);
    this.setData({
      score: list.total_score,
    })
    //综合评分
    let comprehensive_score = [];

    //目标分数
    let target_score = [];
    list.target_score.subject_type.forEach(function(value) {
      list.comprehensive_score.forEach(function(val) {
        if (value.subject_type_name == val.subject_type_name) {
          let scorecha = '---';
          if (!(value.subject_type_name == '口语' || value.subject_type_name == '写作' || value.score == 0)) {
            let userScore = parseFloat(val.score);
            let tarScore = parseFloat(value.score);
            let chaScore = userScore - tarScore;
            if (chaScore > 0) {
              scorecha = "超过" + chaScore + "分";
            } else {
              scorecha = "还差" + Math.abs(chaScore) + "分";
            }
          }
          let oneObject = {
            subject_type_name: list.subject_name + '-' + value.subject_type_name,
            score: value.score,
            scorecha: scorecha,
          }
          target_score.push(oneObject)

          let is_apply = 4;
          if (val.subject_type_name == '口语' || val.subject_type_name == '写作') {
            is_apply = val.is_apply;
          }
          let oneObject2 = {
            subject_type_name: val.subject_type_name,
            score: val.score,
            correct_id: val.correct_id,
            is_apply: is_apply,
            subject_type_id: value.subject_type_id,
          }
          comprehensive_score.push(oneObject2)
          console.log(comprehensive_score);
        }
      })
    })

    let target_score_cha = parseFloat(list.total_score) - parseFloat(list.target_score.score);
    if (target_score_cha == 0) {
      target_score_cha = '---';
    } else {
      target_score_cha = target_score_cha > 0 ? '超过' + target_score_cha + '分' : '还差' + Math.abs(target_score_cha) + '分';
    }

    let subject_type_arr = [];
    list.target_score.subject_type.forEach(function(value) {
      let subject_type_obj = {
        "subject_type_id": value.subject_type_id,
        "subject_type_name": value.subject_type_name,
        "score": parseFloat(value.score),
      }
      subject_type_arr.push(subject_type_obj)
    })
    var new_tk_data = {
      subject_id: list.subject_id,
      subject_name: list.subject_name,
      score: parseFloat(list.target_score.score),
      subject_type: subject_type_arr,
    };

    this.setData({
      comprehensive_score: comprehensive_score,
      target_country: list.target_country,
      target_score: target_score,
      target_score_fen: list.target_score.score,
      target_score_cha: target_score_cha,
      subject_id: list.subject_id,
      subject_name: list.subject_name,
      tk_data: new_tk_data,
      answer_id: list.answer_id,
    });
  },

  //修改目标分数提交
  submitTarget: function() {
    let targat_object = [this.data.tk_data];
    let params = [];
    params.push('subject_id=' + this.data.subject_id);
    params.push('targat_object=' + JSON.stringify(targat_object));
    PublicJS.initData(examine_target_fraction, params, this.submitTargetCall)
  },

  //修改目标分数提交回调
  submitTargetCall: function() {
    this.setData({
      isSuccess: true,
      showModal2: false,
    })

    let that = this;
    this.getComprehensive()
    setTimeout(function() {
      that.setData({
        isSuccess: false,
      })
    }, 1000)
  },

  //批改记录
  getCorrectRecord(e) {
    let params = ['answer_id=' + this.data.answer_id];
    let subject_type_name = e.currentTarget.dataset.name;
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

  // 关闭目标分数修改
  closeModal2() {
    this.setData({
      showModal2: false,
    })

  },
  // 打开目标分数修改
  openModal2() {
    this.setData({
      showModal2: true,
    })
  },

  /**
   * 编辑目标分数
   */
  editTargetFen: function() {
    this.setData({
      showModal2: true,
    })
    var query = wx.createSelectorQuery();
    query.select('.modal2-dialog').boundingClientRect();
    query.exec((res) => {
      var listHeight = res[0].height; // 获取list高度
      this.setData({
        marginTop: -listHeight + 'rpx',
      })

      // console.log(listHeight + '-0000-' + this.data.marginTop);
    })
   

  },


  //申请批改
  applayQue: function(e) {
    let item_id = e.currentTarget.dataset.id;
    let subject_type_id = e.currentTarget.dataset.sid;
    let params = [];
    params.push('answer_id=' + this.data.answer_id);
    params.push('type=3');
    params.push('apply_name='); //申请学员的姓名
    params.push('apply_mobile='); //申请学员的手机号
    params.push('intent_subject_id='); //申请学员的意向科目id 多选用,连接
    params.push('science_type=1');
    params.push('item_id=' + item_id);
    params.push('subject_type_id=' + subject_type_id);
    PublicJS.initData(apply_correct_two, params, this.renderApplay)
  },
  //申请批改回调
  renderApplay: function() {
    this.setData({
      showModal: true,
    })
    this.getComprehensive();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.report_id;
    //科目id,
    this.setData({
      id: id,
    })
    this.getComprehensive();
    this.getBackground();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.modal = this.selectComponent('#modal');
  },

  callback: function() {
    this.setData({
      showModal: true,
    })
    this.modal.modalCallback()
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