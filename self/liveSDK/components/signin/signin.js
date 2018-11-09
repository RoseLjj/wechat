// components/signin/signin.js
const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        signTime: {
            type: String,
            value: ''
        },
        isShowSignin: {
            type: Boolean
        },
        checkBtn: {
            type: String,
            value: '签到'
        },
        aid: {
            type: Number
        },
        usualPx: {
            type: String,
            value: '60'
        },
        isShowBtn: {
            type: Boolean,
            value: true
        }
    },

    /**
    * 组件的初始数据
    */
    data: {
        closeHidden: true
    },

    ready: function(){
        var that = this;
        this.channel = app.globalData.channel;
        //点名
        this.channel.bind("onRollcall", function(e){
            console.log("点名");
            var data = e.data;
            var times = parseInt(data.timeout), m = 0, s = 0, stime;
            var id = data.id;
            if(times > 59){
                m = parseInt(times / 60);
                s = parseInt(times % 60);
            } else {
                m = 0;
                s = times;
            }

            stime = (m>9?m:'0'+m)+':'+(s>9?s:'0'+s);
            that.setData({
                signTime: stime,
                checkBtn: "签到",
                usualPx: "60",
                isShowSignin: true,
                isShowBtn: true,
                closeHidden: true
            });
            that.runTime(id);
        });
    },

    /**
    * 组件的方法列表
    */
    methods: {
        _hideSignin: function(){
            this.setData({
                isShowSignin: false,
                checkBtn: "签到",
                usualPx: "60",
                isShowBtn: true
            });
        },
        _checkTap: function(){
            var that = this;
            if(this.data.checkBtn == "签到"){
                this.channel = app.globalData.channel;
                this.channel.send("submitRollcall", {
                    "id" : that.data.aid
                });
                this.setData({
                    signTime: "签到成功",
                    usualPx: "32",
                    isShowBtn: false
                })
                clearInterval(that.t);
                setTimeout(function(){
                    that.setData({
                        isShowSignin: false
                    });
                }, 3000);
            } else {
                this.setData({
                    isShowSignin: false
                })
            }
            
        },
        runTime: function(id){
            this.setData({
                aid: id
            });
            var that = this, m = 0, s = 0, stime, time = this.data.signTime.split(':');
            time = parseInt(time[0])*60+parseInt(time[1]);
            that.t = setInterval(function(){
                time--;
                if(time <= 0){
                    clearInterval(that.t);
                    that.setData({
                        signTime: "您错过了本次点名",
                        checkBtn: "我知道了",
                        usualPx: "32",
                        closeHidden: false
                    });
                } else {
                    if(time > 59){
                        m = parseInt(time / 60);
                        s = parseInt(time % 60);
                    } else {
                        m = 0;
                        s = time;
                    }

                    stime = (m>9?m:'0'+m)+':'+(s>9?s:'0'+s);
                    that.setData({
                        signTime: stime
                    });
                }
            }, 1000);
        }
    }
})
