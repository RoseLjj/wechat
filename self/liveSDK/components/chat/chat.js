// components/chant/chant.js
const app = getApp();
Component({
    options: {
        multipleSlots: true
    },
    /**
    * 组件的属性列表
    */
    properties: {
        userName: {
            type: String,
            value: ''
        },
        condition: {
            type: Boolean,
            value: false
        },
        lheight: {
            type: String,
            value: ''
        },
        sendUrl: {
            type: String,
            value: '../../assets/icons/send.png'
        },
        //聊天输入框信息
        chatVal: {
            type: String,
            value: ''
        },
        //所有聊天
        allMessage: {
            type: Array,
            value: []
        },
        priMessage: {
            type: Array,
            value: []
        },
        priTalkid: {
            type: String,
            value: ''
        },
        priTalkname: {
            type: String,
            value: ''
        },
        //只有我的聊天
        onlyMine: {
            type: Array,
            value: []
        },
        //显示的聊天
        showAllMessage: {
            type: Array,
            value: []
        }
    },

    /**
    * 组件的初始数据
    */
    data: {
        scrollTopPri: 0,//私聊滚动的高度
        scrollTop: 0,//滚动的高度
        showSelf: true,//私聊时候隐藏，正常情况展示出来
        isSelf: false,//是否是私聊
        onlySelf: "../../assets/icons/onlyMe.png",
        decode: true,//是否解析
        enable: true,//能否聊天
        showUnchat: false,//是否显示提示
        unChatText: "当前禁止聊天，您的信息发送失败",//提示内容
        animationData: {}
    },
    ready: function(){
        var that = this;
        var allEnable = true;//全体禁言
        var singleEnable = true;//个人禁言
        var query = wx.createSelectorQuery().in(that).select('#chat-page').boundingClientRect(),
            queryPri = wx.createSelectorQuery().in(that).select('#chatPri-page').boundingClientRect(),
            firstIn = true;
        this.channel = app.globalData.channel;
        // 收到公聊消息
        this.channel.bind("onPublicChat", function(e){
            console.log("收到公聊信息");
            var data = e.data;
            for(var s = 0; s < data.length; s++){
                that.analysisMess(data[s], "public");
            }
        });
        // 收到私聊消息
        this.channel.bind("onPriChat", function(e){
            console.log("收到私聊信息");
            that.analysisMess(e.data, "private");
        });

        // this.channel.bind("onPubAndPriChat", function(e){
        //     console.log("聊天信息");
        //     var arr = e.data;
        //     for(var k = 0; k < arr.length; k++){
        //         if(arr[k].type == "onPublicChat"){
        //             that.analysisMess(arr[k].data, "public");
        //         } else {
        //             that.analysisMess(arr[k].data, "private");
        //         }
        //     }
        // });
        //收到系统消息
        this.channel.bind("onMessage", function(e){
            console.log("系统消息");
            var msg = {
                senderId: '',
                senderRole: '',
                sender: '系统消息',
                content: e.data.content,
                richtext: e.data.content,
                id: '',
                uid: ''
            }
            that.analysisMess(msg, "sysMsg");
        });

        //删除公聊
        this.channel.bind("onChatRemove", function(e){
            console.log("删除公聊信息");
            var censorList = e.data.censorList, allMess = that.data.allMessage, isSelf = that.data.isSelf;
            for(var i = 0; i < censorList.length; i++){
                for(var k in allMess){
                    if(allMess[k].id == censorList[i].id){
                        allMess.splice(k, 1);
                    }
                }
            }
            if(!isSelf){
                that.setData({
                    showAllMessage: allMess,
                    allMessage: allMess
                })
            }
        });

        //功能配置更改-是否禁言
        this.channel.bind("onSetting", function(e){
            console.log('收到功能配置更改');
            if(e.data.target == 'all'){
                //全体禁言或者提问
                var enable = e.data.enable, content;
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
                var msg = {
                    senderId: '',
                    senderRole: '',
                    sender: '系统消息',
                    content: content,
                    richtext: content,
                    id: '',
                    uid: ''
                }
                that.analysisMess(msg, "sysMsg");
                if(e.data.option == 'chat'){
                    allEnable = enable
                }
            } else if(e.data.target == 'self' && e.data.option == 'chat'){
                //个人禁言
                var enable = e.data.enable;
                singleEnable = enable
            }

            if(singleEnable && allEnable){
                that.setData({
                    enable: true
                })
            } else {
                that.setData({
                    enable: false
                })
            }

        });
        this.analysisMess = function (msg, type){
            var role = msg.senderRole.split(","), roleVal = 0;
            for(var s = 0; s < role.length; s++){
                roleVal += parseInt(role[s]);
            }
            roleVal = roleVal == 0 ? undefined: roleVal;
            var style = '', obj = {
                type: type,
                talkerId: msg.senderId,
                senderRole: roleVal,
                talkerName: msg.sender, 
                msg: msg.content,
                richtext: msg.richtext,
                id: msg.id,
                uid: msg.uid,
                senderTo: msg.senderTo || '我'
            };
            if(msg.richtext && msg.richtext != "" && msg.richtext.indexOf("style") != -1){
                style = msg.richtext.toLocaleLowerCase().split("=")[1].split(">")[0].replace(/\"/g, '');
            }
            obj.style = style;

            var date = new Date();
            var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
            obj.time = this.numTen(hours) + ":" + this.numTen(minutes) + ":" + this.numTen(seconds);

            var allMess = that.data.allMessage, priMess = that.data.priMessage, onlyMi = that.data.onlyMine;
            if(allMess.length >= 500){
                allMess.shift();
            }
            if(priMess.length >= 200){
                priMess.shift();
            }
            if(onlyMi.length >= 300){
                onlyMi.shift();
            }

            allMess.push(obj);

            if(obj.type == "private"){
                priMess.push(obj);
                onlyMi.push(obj);
            } else if(obj.type == "public" && obj.uid == '-2'){
                onlyMi.push(obj);
            }
            that.setData({
                showAllMessage: allMess,
                allMessage: allMess,
                priMessage: priMess,
                condition: true,
                onlyMine: onlyMi
            });
            //聊天滑动到最下面
            query.exec(function(res){
                that.setData({
                    scrollTop: res[0].height
                })
            });
            queryPri.exec(function(res){
                that.setData({
                    scrollTopPri: res[0].height
                })
            });
        };

        this.numTen = function(m){
            return m>9?m:'0'+m;
        }
    },
    /**
    * 组件的方法列表
    */
    methods: {
        _showPrichat: function(e){
            var that = this;
            var talkerId = e.currentTarget.dataset.talkid;
            var talkerName = e.currentTarget.dataset.talkname;
            if(talkerName.length > 12){talkerName = talkerName.substring(0, 12) + '...'}
            if(talkerId==""){
                return false;
            }
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "linear",
                delay: 0
            });
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export(),
                showSelf: false,
                chatVal: '',
                sendUrl: "../../assets/icons/send.png",
                priTalkid: talkerId,
                priTalkname: talkerName
            });
        },
        _closePrichat: function(){
            var that = this;
            var animation = wx.createAnimation({
                duration: 200,
                timingFunction: "linear",
                delay: 0
            });
            animation.translateY('100%').step();
            this.setData({
                animationData: animation.export(),
                showSelf: true,
                chatVal: '',
                sendUrl: "../../assets/icons/send.png",
                priTalkid: '',
                priTalkname: ''
            });
        },
        _inputIn: function(e){
            var val = e.detail.value;
            if(val == "" || val == null || val == undefined){
                this.setData({
                    sendUrl: "../../assets/icons/send.png"
                })
            } else {
                this.setData({
                    sendUrl: "../../assets/icons/send2.png"
                })
            }
            this.setData({
                chatVal: val
            });
        },
        _chatSend: function(e){
            var that = this, val = this.data.chatVal, priTalkid = this.data.priTalkid, priTalkname = this.data.priTalkname, enable = this.data.enable;
            clearTimeout(that.st);
            if(!enable){
                that.setData({
                    unChatText: "当前禁止聊天，您的信息发送失败",
                    showUnchat: true
                });
                that.st = setTimeout(function(){
                    that.setData({
                        showUnchat: false
                    });
                }, 3000);
                return false;
            }
            if(val == '' || val == undefined){
                return false;
            }
            if(priTalkid == '' || priTalkid == null || priTalkid == undefined){
                that.channel.send("submitChat", {"content": val, richtext: val}, function(e){
                    if(e.result){
                        var msg = {
                            senderId: '',
                            senderRole: '',
                            sender: that.data.userName,
                            content: val,
                            richtext: val,
                            id: e.data.uuidStr,
                            uid: '-2'
                        }
                        that.analysisMess(msg, "public");
                        that.setData({
                            chatVal: '',
                            sendUrl: "../../assets/icons/send.png"
                        });
                    } else {
                        that.setData({
                            unChatText: "发送过于频繁，请稍后再重试",
                            showUnchat: true
                        });
                        setTimeout(function(){
                            that.setData({
                                showUnchat: false
                            });
                        }, 3000);
                    }

                });
                
            } else {
                that.channel.send("submitChatTo", {"content": val, richtext: val, receiver: priTalkname, receiverId: priTalkid}, function(e){
                    if(e.result){
                        var msg = {
                            senderId: priTalkid,
                            senderRole: '',
                            sender: that.data.userName,
                            content: val,
                            richtext: val,
                            id: '',
                            uid: '-1',
                            senderTo: priTalkname
                        }
                        that.analysisMess(msg, "private");
                        that.setData({
                            chatVal: '',
                            sendUrl: "../../assets/icons/send.png"
                        });
                    } else {
                        that.setData({
                            unChatText: "发言太快啦，先休息下",
                            showUnchat: true
                        });
                        setTimeout(function(){
                            that.setData({
                                showUnchat: false
                            });
                        }, 3000);
                    }

                });
                
            }
            

        },
        _onlyMe: function(e){
            var isSelf = this.data.isSelf, onlyMine = this.data.onlyMine, allMess = this.data.allMessage, that = this;
            clearTimeout(that.t);
            if(!isSelf){
                if(onlyMine.length > 0){
                    that.setData({
                        onlySelf: '../../assets/icons/onlyMe2.png',
                        isSelf: true,
                        showAllMessage: onlyMine
                    });
                } else {
                    that.setData({
                        onlySelf: '../../assets/icons/onlyMe2.png',
                        isSelf: true,
                        unChatText: "只看我的聊天",
                        showUnchat: true,
                        showAllMessage: onlyMine
                    });
                    that.t = setTimeout(function(){
                        that.setData({
                            showUnchat: false
                        });
                    }, 3000);
                }
            } else {
                that.setData({
                    onlySelf: '../../assets/icons/onlyMe.png',
                    isSelf: false,
                    showUnchat: false,
                    showAllMessage: allMess
                });
            }
        }

    }
})
