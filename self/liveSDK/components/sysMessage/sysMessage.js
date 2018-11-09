// components/sysMessage/sysMessage.js
const app = getApp();
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
        messageVal: '',
        isShowSys: false,
        transText: '100%',
        animationData: {}
    },
    ready: function(){
        var that = this;
        this.channel = app.globalData.channel;
        //系统消息
        this.channel.bind("onMessage", function(e){
            console.log("系统消息");
            that.setData({
                messageVal: e.data.content,
                isShowSys: true
            });
            setTimeout(function(){
                that.gotMessage(); 
            }, 1000)
           
        });
        //功能配置修改
        this.channel.bind("onSetting", function(e){
            console.log('收到功能配置更改');
            var enable = e.data.enable, content;
            if(e.data.target == 'all'){
                if(e.data.option == 'question'){
                    if(enable){
                        content = '现在允许提问';
                    } else {
                        content = '现在禁止提问';
                    }
                } else if(e.data.option == 'chat') {
                    if(enable){
                        content = '现在允许聊天';
                    } else {
                        content = '现在禁止聊天';
                    }
                } else {
                    return false;
                }
                that.setData({
                    messageVal: content,
                    isShowSys: true
                });
                setTimeout(function(){
                    that.gotMessage(); 
                }, 1000)
            }
            
        });
    },
    /**
    * 组件的方法列表
    */
    methods: {
        gotMessage: function(){
            var that = this;
            var animation = wx.createAnimation({
                duration: 6000,
                timingFunction: "linear",
                delay: 0
            });
            animation.translateX("-100%").step();

            this.setData({
                animationData: animation.export()
            });

            
            var animation2 = wx.createAnimation({
                duration: 0,
                timingFunction: "linear",
                delay: 0
            });
            animation2.translateX("100%").step();
            setTimeout(function(){
                that.setData({
                    animationData: animation2.export()
                })
            }, 7000);

            
            var animation3 = wx.createAnimation({
                duration: 6000,
                timingFunction: "linear",
                delay: 0
            });
            animation3.translateX("-100%").step();
            setTimeout(function(){
                that.setData({
                    animationData: animation3.export()
                })
            }, 8000);
            

            var animation4 = wx.createAnimation({
                duration: 0,
                timingFunction: "linear",
                delay: 0
            });
            animation4.translateX("100%").step();
            setTimeout(function(){
                that.setData({
                    animationData: animation4.export(),
                    isShowSys: false
                })
            }, 14500);
        }
    }
})
