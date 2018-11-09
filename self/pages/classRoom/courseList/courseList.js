// pages/classRoom/courseList/courseList.js
var app = getApp();
var kebiaoByDate = require('../../../utils/config.js').classListMini;
var uploadFileUrl = require('../../../utils/config.js').uploadFile;
var uploadWorkUrl = require('../../../utils/config.js').uploadWork;
var studentFeekbackUrl = require('../../../utils/config.js').studentFeekback;
var popuprecordUrl = require('../../../utils/config.js').popuprecord;
var config = require('../../../utils/config.js');

var PublicJS = require('../../../utils/require.js');
var index = 0;
var courseId; // 课程ID
var zuoyevalue;
var baogaovalue;
var type;
var itemDay; 


Page({

  //展示日历
  calendarAction: function() {
    var mBol = this.data.flagView
    mBol = !mBol
    this.setData({
      flagView: mBol,
      shang_flag: mBol,
      xia_flag: !mBol
    })
    console.log('mBol=' + mBol);
  },

  //进入教室点击
  intoClassRoomClick: function(e) {
    console.log("进入教室点击");
    var model = e.currentTarget.dataset.model;
    if (model.status != 1) {//只有上课中才可以进入
      return;
    }
    var options = {};
    options.authcode = model.student_key;
    options.username = model.nickname;
    options.id = model.class_code;
    options.title = model.class_hour_name;
    var item = JSON.stringify(options);
    wx.navigateTo({
      url: '../classLive/classLive?item='+item,
    })
  },
  //未开始点击
  unActionClick: function() {
    console.log("未开始点击")
  },

  /**
   * 页面的初始数据
   */
  data: {
    //日历应用 start 
    year: 0,
    month: 0,
    date: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    dateArr: [],
    isToday: 0,
    isTodayWeek: false,
    todayIndex: 0,
    // 日历引用end
    imgStr: ['student/wechat/image/background/bg_01.png'],
    bgcImg: [],
    questType: app.globalData.questType,
    flagView: true,
    xia_flag: false,
    shang_flag: true,

    // 作业
    zuoyeflag: true,
    imagesArr: [],
    closeImage: "../../../image/icon/guanbi@2x.png",
    zuoyevalue: "",   // 文本的内容
    baogaovalue: "",   // 文本的内容

    imgUrls:"",// 上传到服务器的图片地址
    zuoyeplaceholder: "请输入备注信息...",
    maxlength: 50, // 最大输入长度，设置为 -1 的时候不限制最大长度
    zuoyebuttonStat : false, // 是否显示底部按钮
    imageMax:false, //是否隐藏
    baogaobottonStat : false,

    // 报告/评价
    baogaoflagView: true, // 弹框状态
    titleArr: [{
                "text":"课前预习：",
                "flag": 0
                }, 
                {
                  "text":"上课状态：",
                  "flag": 0
                }, 
                {
                  "text": "课堂互动：",
                  "flag": 0
                }],

    learning: "", //学习情况
    teaching: "", // 授课内容

    isShow: true, // 是否点击去评论
    imageStatus: "../../../image/icon/jtxia2@2x.png",

    lecturerName: "", //讲师名称
    lecturerArr: [{
                  "text":"授课情况：",
                  "flag": 3
                  }, {
                  "text": "通讯情况：",
                  "flag": 3
                  }],
    baogaoplaceholder: "有什么话对老师说",
  },
  //日历点击
  ondateClick: function(e) {
    this.calendarAction();
    itemDay = e.currentTarget.dataset.item;
    this.setData({
      isToday: itemDay.isToday
    });
    this.getKebiaoByDate(itemDay.myyear, itemDay.mymonth, itemDay.mydate)
  },
  /**
   * 弹出层函数 作业
   */
  // 作业点击  出现

  zuoyeClick: function (e) {
    var item = e.currentTarget.dataset.item;//外层
    var model = e.currentTarget.dataset.model;//内层
    courseId = model.id;
    var task = model.task;
    var arr = task.student_url.split(",");
    arr.pop();

    if (task.is_student_task == 1) { // 添加按钮隐藏
      this.setData({
        imageMax: true
      })
    } else {
      this.setData({
        imageMax: false
      })
    }
    this.setData({
        imagesArr: [],
        zuoyebuttonStat: task.is_student_task,
    })

    var arrUrl = this.data.imagesArr;
   
    for(var i in arr){
      arr[i] = config.fileBaseUrl + arr[i];
      arrUrl.push(arr[i]);
    }
    this.setData({
      zuoyevalue: task.student_remarks,
      zuoyecurrentNumber: task.student_remarks.length,
      imagesArr: arrUrl,
    })    
    this.setData({ zuoyeflag: false })
  },
  //消失
  zuoyehide: function () {
    this.setData({ zuoyeflag: true })
    this.setData({
      zuoyevalue: "",
      imagesArr: []
    })
  },

  // 取消
  zuoyecancel: function () {
    this.setData({ zuoyeflag: true })
    this.setData({
      zuoyevalue: "",
      imagesArr: []
    })
  },
  
  // 提交
  zuoyesubmit: function (e) {
    this.submitTask();
    this.setData({ zuoyeflag: true })
  },

  // 选择相册添加图片
  btnAddAction: function() {
    if (this.data.zuoyebuttonStat == 0){
      var list = this.data.imagesArr;
      var that = this;
      var imagesArr = this.data.imagesArr;
      if (imagesArr.length >= 6) {
        this.setData({
          lenMore: 1
        });
        setTimeout(function () {
          that.setData({
            lenMore: 0
          });
        }, 2500);
        this.setData({
          imageMax : true
        })
        return false;
      }
      wx.chooseImage({
        count: 6, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          var imagesArr = that.data.imagesArr;
          // console.log(tempFilePaths + '----');
          for (var i = 0; i < tempFilePaths.length; i++) {
            if (imagesArr.length >= 6) {
              that.setData({
                imagesArr: imagesArr,
              });
              return false;
            } else {
              imagesArr.push(tempFilePaths[i]);
              if (imagesArr.length >= 6){
                that.setData({
                  imageMax: true
                })
              }else{
                that.setData({
                  imageMax: false
                })
              }
            }
          }
          that.setData({
            imagesArr: imagesArr
          });
        }
      });
    }
  },
// 点击查看大图
  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var arrImage = this.data.imagesArr;
    wx.previewImage({
      current: arrImage[index],     //当前图片地址
      urls: arrImage,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 删除图片
  deleteImage: function (e) {
    if (this.data.zuoyebuttonStat == 0) {
      var that = this;
      var images = that.data.imagesArr;
      var index = e.currentTarget.dataset.index;//获取当前长按图片下标
      wx.showModal({
        title: '提示',
        content: '确定要删除此图片吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('点击确定了');
            images.splice(index, 1);
          } else if (res.cancel) {
            console.log('点击取消了');
            return false;
          }
          that.setData({
            imagesArr: images
          });
          if (that.data.imagesArr.length >= 6) {
            that.setData({
               imageMax: true
            })
          } else {
            that.setData({
              imageMax: false
            })
          }
        }
      })
    }
  },
  //字数限制  
  zuoyeinputs: function(e) {
    // 获取输入框的内容
    zuoyevalue = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(zuoyevalue.length);
    //最多字数限制
    if (len > this.data.maxlength) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      zuoyecurrentNumber: len //当前字数  
    });
  },

  //上传作业 获取图片地址
  submitTask() {
    var imagesArr = this.data.imagesArr;
    PublicJS.fileNameUpload(imagesArr[index], this.uploadFile);
  },

  uploadFile: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    var imgUrls = this.data.imgUrls;
    imgUrls = imgUrls + data.data.file + ",";
    this.setData({
      imgUrls: imgUrls
    });
    index++;
    if (index < this.data.imagesArr.length) {
        this.submitTask();
    }else {
      console.log(this.data.imgUrls);
      this.submitUploadWorkback();
    }
  },
  
  //学生提交作业
  submitUploadWorkback() {
    let arr = ['id=' + courseId, "workurl=" + this.data.imgUrls, "work_remarks=" + zuoyevalue,"work_name="+"zuoyeName"];
    console.log("参数=========" +arr)
    PublicJS.initData(uploadWorkUrl, arr, this.loadUploadWorkback);
  },
  loadUploadWorkback: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    console.log("学生提交作业"+data)
    this.setData({
      zuoyevalue: "",
      imagesArr : []
    })

    type = 2;
    this.showPopUpRecord();
  },

// 学生提交评价
  submitStudentFeekback(){
    
    let arr = ['id=' + courseId, "communication_quality=" + this.data.lecturerArr[1].flag, "teaching_situation=" + this.data.lecturerArr[0].flag,"idea=" + baogaovalue];
    PublicJS.initData(studentFeekbackUrl, arr, this.loadStudentFeekback);
  },
  loadStudentFeekback: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    console.log("学生提交评价" + data)
    this.setData({
      baogaovalue: ""
    })

    type = 3;
    this.showPopUpRecord();
  },


  // 教师弹框记录 取消小红点
  showPopUpRecord() {   //2作业 3 评价
    let arr = ['class_id=' + courseId, "type=" + type];
    console.log("参数=========" +arr)
    PublicJS.initData(popuprecordUrl, arr, this.loadPopUpRecord);
  },
  loadPopUpRecord: function (data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    this.setData({
      isToday: itemDay.isToday
    });
    this.getKebiaoByDate(itemDay.myyear, itemDay.mymonth, itemDay.mydate)
  },



  //报告/评价点击
  /**
   * 弹出层函数
   */

  baogaoClick: function (e) {
    var item = e.currentTarget.dataset.item;//外层
    var model = e.currentTarget.dataset.model;//内层
    courseId = model.id;
    var feedback = model.feedback;
    var evaluate = model.evaluate;

    var modificationTodo1 = "titleArr[" + 0 + "].flag";
    var modificationTodo2 = "titleArr[" + 1 + "].flag";
    var modificationTodo3 = "titleArr[" + 2 + "].flag";
    this.setData({
      [modificationTodo1]: feedback.preview_fraction, //"课前预习"
      [modificationTodo2]: feedback.status_fraction, //"上课状态",
      [modificationTodo3]: feedback.questions_fraction, //"课堂互动",
    });

    var modificationTodo1 = "lecturerArr[" + 0 + "].flag";
    var modificationTodo2 = "lecturerArr[" + 1 + "].flag";
    this.setData({
      [modificationTodo1]: evaluate.teaching_situation, // 授课情况
      [modificationTodo2]: evaluate.communication_quality, // 通讯情况
    });
    this.setData({
      learning: feedback.learning_situation, //"学习情况",
      teaching: feedback.teaching_content, //"授课内容",

      baogaobottonStat: evaluate.is_evaluate,
      lecturerName : evaluate.teacher_name,
      baogaovalue: evaluate.idea,
      baogaocurrentNumber: evaluate.idea.length,
    }),

    this.setData({ baogaoflagView: false })
  },
  //消失
  baogaohide: function () {
    this.setData({ baogaoflagView: true })
    this.setData({
      baogaovalue: "",
    })
  },

  // 取消
  baogaocancel: function () {
    this.setData({ baogaoflagView: true })
    this.setData({
      baogaovalue: "",
    })
  },

  // 提交
  baogaosubmit: function () {
    this.submitStudentFeekback();
    this.setData({ baogaoflagView: true })
  }, 


// 评价五角星
  changeColor21: function (e) {
    if (this.data.baogaobottonStat == 0){
      var item = e.currentTarget.dataset.item;
      var id = e.currentTarget.id;
      var that = this;
      var modificationTodo = "lecturerArr[" + id + "].flag";
      that.setData({
        [modificationTodo]: 1
      });
    }
  },

  changeColor22: function (e) {
    if (this.data.baogaobottonStat == 0) {
      var item = e.currentTarget.dataset.item;
      var id = e.currentTarget.id;
      var that = this;
      var modificationTodo = "lecturerArr[" + id + "].flag";
      that.setData({
        [modificationTodo]: 2
      });
    }
  },

  changeColor23: function (e) {
    if (this.data.baogaobottonStat == 0) {
      var item = e.currentTarget.dataset.item;
      var id = e.currentTarget.id;
      var that = this;
      var modificationTodo = "lecturerArr[" + id + "].flag";
      that.setData({
        [modificationTodo]: 3
      });
    }
  },

  changeColor24: function (e) {
    if (this.data.baogaobottonStat == 0) {
      var item = e.currentTarget.dataset.item;
      var id = e.currentTarget.id;
      var that = this;
      var modificationTodo = "lecturerArr[" + id + "].flag";
      that.setData({
        [modificationTodo]: 4
      });
    }
  },
  
  changeColor25: function (e) {
    if (this.data.baogaobottonStat == 0) {
      var item = e.currentTarget.dataset.item;
      var id = e.currentTarget.id;
      var that = this;
      var modificationTodo = "lecturerArr[" + id + "].flag";
      that.setData({
        [modificationTodo]: 5
      });
    }
  },

  // 点击去评价
  tapEvaluation: function() {
    var isBool = this.data.isShow;
    isBool = !isBool;
    var imageStatus;
    if (isBool == true) {
      imageStatus = "../../../image/icon/jtxia2@2x.png"
    } else if (isBool == false) {
      imageStatus = "../../../image/icon/jtshang2@2x.png"
    }
    this.setData({
      isShow: isBool,
      imageStatus: imageStatus
    })
  },

  //字数限制  
  baogaoinputs: function(e) {
    // 获取输入框的内容
    baogaovalue = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(baogaovalue.length);
    //最多字数限制
    if (len > this.data.maxlength) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      baogaocurrentNumber: len //当前字数  
    });
  },



  //获取科目列表
  listresult: function(data) {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
    if (data.errorCode == 0) {
      console.log(data);
      var list = data.data.list;
      this.setData({
        courseListArr: list
      })
    } else {
      console.log(data.errorMessage);
    }
  },
  //获取科目列表
  getKebiaoByDate(e, e2, e3) {
    console.log(e + "=" + e2 + "=" + e3)
    var parameter = "";
    if (e2.length < 2) {
      if (e3.length < 2) {
        parameter = e + "-0" + e2 + "-0" + e3
      } else {
        parameter = e + "-0" + e2 + "-" + e3
      }
    } else {
      if (e3.length < 2) {
        parameter = e + "-" + e2 + "-0" + e3
      } else {
        parameter = e + "-" + e2 + "-" + e3
      }

    }
    console.log("parameter================"+parameter)
    let arr = ['day=' + "" + parameter];
    PublicJS.initData(kebiaoByDate, arr, this.listresult);
  },

  //科目点击到单题
  queryItemClick: function(e) {
    // var that = this;
    // //拿到点击的index下标
    // console.log(e);
    // var index = e.currentTarget.dataset.index;
    // console.log(index);
    // //将对象转为string
    // var queryBean = JSON.stringify(this.data.courseListArr[index].id);
    // console.log(queryBean);
    // wx.navigateTo({
    //   url: '../questionsType/questionsType?id=' + queryBean,
    // })
  },

  getBackground: function() {
    let imgUrl = app.data.imgUrl;
    let bgcImg = [];
    this.data.imgStr.forEach(function(value) {
      bgcImg.push(imgUrl + value);
    })
    this.setData({
      bgcImg: bgcImg,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBackground();
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    this.dateInit();
    this.setData({
      year: year,
      month: month,
      isToday: '' + year + month + now.getDate(),
    })
    this.getKebiaoByDate(year, month, now.getDate());
  },

  dateInit: function(setYear, setMonth) {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let dateArr = []; //需要遍历的日历数组数据
    let arrLen = 0; //dateArr的数组长度
    let now = setYear ? new Date(setYear, setMonth) : new Date();
    let year = setYear || now.getFullYear();
    let nextYear = 0;
    let month = setMonth || now.getMonth(); //没有+1方便后面计算当月总天数
    let nextMonth = (month + 1) > 11 ? 1 : (month + 1);
    let startWeek = new Date(year + ',' + (month + 1) + ',' + 1).getDay(); //目标月1号对应的星期
    let dayNums = new Date(year, nextMonth, 0).getDate(); //获取目标月有多少天
    let obj = {};
    let num = 0;

    if (month + 1 > 11) {
      nextYear = year + 1;
      dayNums = new Date(nextYear, nextMonth, 0).getDate();
    }
    arrLen = startWeek + dayNums;
    for (let i = 0; i < arrLen; i++) {
      if (i >= startWeek) {
        num = i - startWeek + 1;
        obj = {
          myyear: year,
          mymonth: month + 1,
          mydate: num,
          isToday: '' + year + (month + 1) + num,
          dateNum: num,
        }
      } else {
        obj = {};
      }
      dateArr[i] = obj;
    }
    this.setData({
      dateArr: dateArr
    })

    let nowDate = new Date();
    let nowYear = nowDate.getFullYear();
    let nowMonth = nowDate.getMonth() + 1;
    let nowWeek = nowDate.getDay();
    let getYear = setYear || nowYear;
    let getMonth = setMonth >= 0 ? (setMonth + 1) : nowMonth;

    if (nowYear == getYear && nowMonth == getMonth) {
      this.setData({
        isTodayWeek: true,
        todayIndex: nowWeek
      })
    } else {
      this.setData({
        isTodayWeek: false,
        todayIndex: -1
      })
    }
  },
  lastMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month - 2 < 0 ? this.data.year - 1 : this.data.year;
    let month = this.data.month - 2 < 0 ? 11 : this.data.month - 2;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
  },
  nextMonth: function() {
    //全部时间的月份都是按0~11基准，显示月份才+1
    let year = this.data.month > 11 ? this.data.year + 1 : this.data.year;
    let month = this.data.month > 11 ? 0 : this.data.month;
    this.setData({
      year: year,
      month: (month + 1)
    })
    this.dateInit(year, month);
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