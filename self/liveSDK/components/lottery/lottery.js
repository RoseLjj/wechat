// components/lottery/lottery.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        currentState:{//抽奖状态 0开始 1抽奖中止 2中奖名单
            type: Number,
            value: 0
        },
        isShowLottery: {
            type: Boolean,
            value: false
        },
        wardNames: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        animationBgimg: {},
        animationMove: {}
    },
    ready: function(){
        var that = this;
        this.channel = app.globalData.channel;

        var names = [];
        //抽奖
        this.channel.bind("onLottery", function(e){
            var type = e.data.action;
            if(type == 'start'){
                names.splice(0, names.length);
                that.changeStatus(0);
                that.showLottery();
                that.startLottery();
            } else if(type == 'stop'){
                if(e.data.user && e.data.user != ''){
                    var result = e.data.user.split('\r\n');
                    for(var k in result){
                        if(result.length == 1 || (result.length > 1 && k != (result.length-1))){
                            names.push(result[k]);
                        }
                    }
                }
                that.setData({
                    wardNames: names,
                    isShowLottery: true
                });
                that.changeStatus(2);
                clearInterval(that.t);
            } else if(type == 'abort'){
                clearInterval(that.t);
                that.changeStatus(1);
            }
        });
    },

    /**
     * 组件的方法列表
     */
    methods: {
        showLottery: function(){
            this.setData({
                isShowLottery: true
            });
        },
        hideLottery: function(){
            this.setData({
                isShowLottery: false
            });
        },
        changeStatus: function(type){
            this.setData({
                currentState: type
            });
        },
        // checkNames: function(){
        //     this.setData({
        //         wardNames: this.names
        //     });
        //     this.changeStatus(4);
        // },
        startLottery: function(){
            var that = this;
            // var animation = wx.createAnimation({
            //     duration: 1000,
            //     timingFunction: "linear",
            //     delay: 0
            // });

            // animation.rotate(180).step();
            // that.setData({
            //     animationBgimg: animation.export()
            // })

            // var n = 1;
            // setInterval(function(){
            //     n++;
            //     animation.rotate(180*n).step();
            //     that.setData({
            //         animationBgimg: animation.export()
            //     })
            // }, 1000)

            var animation2 = wx.createAnimation({
                duration: 500,
                timingFunction: "linear",
                delay: 0
            });
            animation2.translateX("200%").step();
            var t1 = setTimeout(function(){
                that.setData({
                    animationMove: animation2.export()
                })
            }, 100);


            var animation3 = wx.createAnimation({
                duration: 0,
                timingFunction: "linear",
                delay: 0
            });
            animation3.translateX("-200%").step();
            var t2 = setTimeout(function(){
                that.setData({
                    animationMove: animation3.export()
                })
            }, 700);
            
            that.t = setInterval(function(){
                clearTimeout(t1);
                clearTimeout(t2);
                animation2.translateX("200%").step();
                animation3.translateX("-200%").step();
                that.setData({
                    animationMove: animation2.export()
                })
                t1 = setTimeout(function(){
                    that.setData({
                        animationMove: animation3.export()
                    })
                }, 600);
            }, 800)
        }

    }
})
