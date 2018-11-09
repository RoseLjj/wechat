// components/background/background.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl:'',
    imgStr:['student/wechat/image/background/bg_07.png'],
    bgcImg:[],
  },
  attached:function(){
    
  },

  ready:function(){
    let imgUrl = app.data.imgUrl;
    let bgcImg = [];
    this.data.imgStr.forEach(function(value){
      bgcImg.push(imgUrl + value);
    })
    this.setData({
      bgcImg: bgcImg,
    })
  },



  /**
   * 组件的方法列表
   */
  methods: {

  }
})
