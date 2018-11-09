// components/record/record.js
let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showRecordModal: Boolean, //是否展示弹框
    recordArr:{
      type:Array,
      value:[
        { 
          is_audio:true,
          audio_file:'http://img.test.ryit.co/guanghe/20181107/R7naee201811072511023147.mp3',
          audio_tname:'Kontinuum-Lost1.mp3',
          img2:'',
        },
        {
          is_audio: true,
          audio_file:'http://img.test.ryit.co/guanghe/20181024/V7Fjqi201810241770323992.mp3',
          audio_tname: 'Kontinuum-Lost1.mp3',
          img2: '',
        },
        {
          is_audio: false,
          audio_file: 'http://img.test.ryit.co/guanghe/20181107/IjyYza201811079593219120.docx',
          audio_tname: '检测师.docx',
          img2: '',
        },
      ]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgStr: ['student/wechat/image/assets/pigaiwenjian@3x.png', 'student/wechat/image/assets/guanbi@3x.png', 'student/wechat/image/assets/luyinbofang@3x.png','student/wechat/image/gif/luyinbofang@2x.gif'],
    bgcImg: [],
    backgroundAudioManager:null,
    
  },
  ready: function () {
    console.log(this.properties.modalConfirm)
    this.getBackground();
    console.log(this.data.bgcImg[2]);
    this.setData({
      img2: this.data.bgcImg[2],
      img3: this.data.bgcImg[3],
    })
    let _this = this;
    let recordArr = this.properties.recordArr;
    recordArr.forEach(function(value){
      value.img2 = _this.data.bgcImg[2]
    })
    console.log(recordArr);
    this.setData({
      recordArr: recordArr
    })
    // this.audioCtx = wx.createInnerAudioContext('myAudio')
    const innerAudioContext = wx.createInnerAudioContext();
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    this.setData({
      backgroundAudioManager: backgroundAudioManager,
      innerAudioContext: innerAudioContext,
      // audioCtx: wx.createInnerAudioContext('myAudio')
    })

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //查看文件
    checkWord(e) {
      this.data.innerAudioContext.pause();
      var url = e.currentTarget.dataset.url;
      wx.downloadFile({
        url:url,
        success:function(res){
          var filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success:function(){

            },
            fial:function(){

            },
            complete:function(){

            }
          })
        }
      })
     
    },
    getBackground() {
      let imgUrl = app.data.imgUrl;
      let bgcImg = [];
      this.data.imgStr.forEach(function (value) {
        bgcImg.push(imgUrl + value);
      })
      this.setData({
        bgcImg: bgcImg,
      })
    },

    // /**
    //  * 弹窗
    //  */
    // showDialogBtn: function () {
    //   console.log('1111')
    //   this.setData({
    //     showModal: true
    //   })
    // },

    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showRecordModal: false
      });
      this.data.innerAudioContext.pause();
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      if (this.properties.modalType == 1) { //事件1
        console.log('confirm 提示')
      }
      this.hideModal();
    },
    audioPlay: function (e) {
      let index = e.currentTarget.dataset.index;
      this.data.innerAudioContext.pause();
      let that = this;
      wx.downloadFile({
        url: e.currentTarget.dataset.url,
        success:function(res){
          that.data.innerAudioContext.src = res.tempFilePath;
          that.data.innerAudioContext.play();
          console.log(that.data.innerAudioContext.duration);
          that.data.innerAudioContext.onPlay(() => {
            let recordArr = that.properties.recordArr;
            recordArr.forEach(function(value){
              value.img2 = that.data.bgcImg[2];
            })
            recordArr[index].img2 = that.data.bgcImg[3];
            that.setData({
              recordArr: recordArr,
            })
          })
          that.data.innerAudioContext.onPause(() => {
            let recordArr = that.properties.recordArr;
            recordArr[index].img2 = that.data.bgcImg[2];
            that.setData({
              recordArr: recordArr,
            })
          })
          that.data.innerAudioContext.onStop(() => {
            let recordArr = that.properties.recordArr;
            recordArr[index].img2 = that.data.bgcImg[2];
            that.setData({
              recordArr: recordArr,
            })
          })
        }
      })
      
      // this.data.audioCtx.setSrc(e.currentTarget.dataset.url)
      // this.data.audioCtx.play()
      // this.data.backgroundAudioManager.src = e.currentTarget.dataset.url;
      // this.data.backgroundAudioManager.play()
    },
    audioPause: function () {
      this.audioCtx.pause()
    },
    
  }
})
