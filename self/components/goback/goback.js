// components/goback/goback.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    steps: Number,
    type: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    steps: 0,
    type: 0
  },

  ready() {
    // this.goback2();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goback() {
      console.log(this.data.type)
      if (this.data.type == 1 && this.data.steps > 0) {
        this.setData({
          steps: this.data.steps - 1
        })
        this.triggerEvent('numChange', this.data.steps);
      } else {
        console.log('goback');
        wx.navigateBack();
      }
    },
  }
})