// common/clover/clover.js
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cloverNumber:String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  ready:function(){
    this.setData({
      bgcImg: app.globalData.bgcImg
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
