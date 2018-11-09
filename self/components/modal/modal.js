// components/modal/modal.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modalMeesage:String, //提示消息
    modalConfirm:String, //确定按钮文本
    modalCancel:String,  //取消按钮文本
    showModal:Boolean, //是否展示弹框
    modalType:Number,  //弹框事件类型
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgStr: ['student/wechat/image/assets/tishi@3x.png', 'student/wechat/image/assets/guanbi@3x.png'],
    bgcImg: [],
  },
  ready:function(){
    console.log(this.properties.modalConfirm)
    this.getBackground();
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
        showModal: false
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      console.log('111');
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {
      if (this.properties.modalType == 1){ //事件1
        console.log('confirm 提示')
      }
      this.modalCallback()
      this.hideModal();
    },
    modalCallback: function (callback){
      callback()
    }
  }
})
