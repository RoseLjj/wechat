// components/question/question.js
const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        condition:{
            type: Boolean,
            value: false
        },
        lheight:{
            type: String,
            value: ''
        },
        sendUrl: {
            type: String,
            value: '../../assets/icons/send.png'
        },
        allList: {
            type: Array,
            value: []
        },
        meList: {
            type: Array,
            value: []
        },
        showList: {
            type: Array,
            value: []
        },
        vioceAns: {
            type: Boolean,
            value: false
        }

    },

    /**
    * 组件的初始数据
    */
    data: {
        scrollTop: 0,//滚动的高度
        qaVal: '',
        downUrl: '../../assets/icons/answer-down.png',
        upUrl: '../../assets/icons/answer-up.png',
        enable: true,//是否允许问答
        showUnchat: false,//是否显示
        unChatText: '',//禁止内容
        onlySelf: "../../assets/icons/onlyMe.png",
        isSelf: false,
        currentId: -1
    },
    ready: function(){
        var that = this;
        var allEnable = true;//全部是否禁言
        var singleEnable = true;//个人是否禁言
        this.qaid_old = [];
        this.qaid_del = [];
        this.channel = app.globalData.channel;
        var query = wx.createSelectorQuery().in(that).select('#qa-box').boundingClientRect();

        //收到问答
        this.channel.bind("onQA", function(e){
            console.log("收到问答消息");
            var qadatas = e.data;

            var all = that.data.allList, mine = that.data.meList, isSelf = that.data.isSelf;
            var indel = that.qaid_in(that.qaid_del, qadatas.id);
                
            if(indel){
                for(var p in that.qaid_del){
                     if(that.qaid_del[p] == qadatas.id){
                        that.qaid_del.splice(p,1);
                        that.qaid_old.push(qadatas.id);
                        for(var j = 0; j<all.length;j++){
                            if(qadatas.id == all[j].id || qadatas.id == all[j].id){
                                all[j].unMove = true;
                            }
                        }
                        for(var m = 0; m<mine.length; m++){
                            if(qadatas.id == mine[m].id || qadatas.id == mine[m].id){
                                mine.unMove = true;
                            }
                        }
                    }
                }
            }
            var inold = that.qaid_in(that.qaid_old, qadatas.id);
            if(inold && !qadatas.answer){
                if(isSelf){
                    that.setData({
                        allList: all,
                        showList: mine,
                        meList: mine
                    });
                } else {
                    that.setData({
                        allList: all,
                        showList: all,
                        meList: mine
                    });
                }
                that.checkClear();
                return false;
            } 
            var date, obj = {};
            if(!inold){
                qadatas.reply = false;
                that.qaid_old.push(qadatas.id);
                date = new Date(qadatas.submitTime * 1000);
            } else {
                qadatas.reply = true;
                qadatas.submitor = qadatas.submitor;
                qadatas.answerBy = qadatas.answerBy;
                date = new Date(qadatas.answerTime * 1000);
            }

            qadatas.unMove = true;

            var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
            qadatas.time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);

            if(qadatas.qaownerId == app.globalData.userInfo.userid){
                qadatas.questionowner = "我";
                qadatas.submitor = "我";
                mine.push(qadatas);
            }
            all.push(qadatas);

            if(isSelf){
                that.setData({
                    allList: all,
                    showList: mine,
                    meList: mine
                });
            } else {
                that.setData({
                    allList: all,
                    showList: all,
                    meList: mine
                });
            }
            that.checkClear();
        });

        //收到历史问答
        this.channel.bind("onQAList", function(e){
            console.log("收到历史问答");
            var qadatas = e.data.list;
            var all = that.data.allList, mine = that.data.meList, isSelf = that.data.isSelf;
            for(var i = 0; i < qadatas.length; i++){
                var obj = qadatas[i];
                var indel = that.qaid_in(that.qaid_del, obj.id);
                var inold = that.qaid_in(that.qaid_old, obj.id);

                if(obj.remove == true){
                    if(!indel){
                        that.qaid_del.push(obj.id);
                    }
                    continue;
                }
                if(!indel) {
                    obj.unMove = true;
                }

                if(!inold && obj.answer){
                    obj.reply = false;
                    that.qaid_old.push(obj.id);
                    var date = new Date(obj.submitTime * 1000);
                    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                    obj.time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);
                    if(obj.qaownerId == app.globalData.userInfo.userid){
                        obj.submitor = "我";
                        mine.push(obj);
                    }
                    all.push(obj);

                    var newObj = {};
                    for(var k in obj){
                        newObj[k] = obj[k];
                    }

                    newObj.reply = true;
                    if(newObj.qaownerId == app.globalData.userInfo.userid){
                        newObj.submitor = "我";
                        mine.push(newObj);
                    }
                    all.push(newObj);
                    continue;

                } else if(!inold){
                    obj.reply = false;
                    that.qaid_old.push(obj.id);
                } else {
                    obj.reply = true;
                }
                var date = new Date(obj.submitTime * 1000);
                var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                obj.time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);


                if(obj.qaownerId == app.globalData.userInfo.userid){
                    obj.submitor = "我";
                    mine.push(obj);
                }

                all.push(obj);
            }
            if(isSelf){
                that.setData({
                    allList: all,
                    showList: mine,
                    meList: mine
                });
            } else {
                that.setData({
                    allList: all,
                    showList: all,
                    meList: mine
                });
            }
            that.checkClear();
        });

        //某条问题语音回复状态
        this.channel.bind("onTagAudio", function(e){
            console.log("已加入语音回复列表");
            var id = e.data.id;
            that.qaStatus(id, 1);
        });

        this.channel.bind("onQAHighlight", function(e){
            console.log("语音回复中");
            var id = e.data.id;
            that.qaStatus(id, 2);
        });

        this.channel.bind("onCancelHighlight", function(e){
            console.log("语音已回复");
            var id = e.data.id;
            that.qaStatus(id, 3);
        });

        this.qaStatus = function(id, typeNum){
            var all = that.data.allList, mine = that.data.meList, isSelf = that.data.isSelf;
            for(var i = 0; i < all.length; i++){
                if(all[i].id == id && !all[i].reply){
                    all[i].ansVoice = typeNum;
                }
            }
            for(var k = 0; k < mine.length; k++){
                if(mine[k].id == id && !mine[k].reply){
                    mine[k].ansVoice = typeNum;
                }
            }

            if(isSelf){
                that.setData({
                    allList: all,
                    showList: mine,
                    meList: mine
                });
            } else {
                that.setData({
                    allList: all,
                    showList: all,
                    meList: mine
                });
            }
        }

        //清除某条问答
        this.channel.bind("onQARemove", function(e){
            console.log("清除某条问答");
            var id = e.data.id;
            var all = that.data.allList, mine = that.data.meList, isSelf = that.data.isSelf;
            that.qaid_del.push(id);

            for(var n in that.qaid_old){
                if(that.qaid_old[n] == id){
                    that.qaid_old.splice(n,1);

                    for(var j = 0; j<all.length;j++){
                        if(id == all[j].id || id == all[j].id){
                            all[j].unMove = false;
                        }
                    }
                    for(var m = 0; m<mine.length; m++){
                        if(id == mine[m].id || id == mine[m].id){
                            mine.unMove = false;
                        }
                    }
               }
            }
            if(isSelf){
                that.setData({
                    allList: all,
                    showList: mine,
                    meList: mine
                });
            } else {
                that.setData({
                    allList: all,
                    showList: all,
                    meList: mine
                });
            }
            that.checkClear();
        });

        //功能配置更改-是否禁止问答(个人禁言与聊天是同步的)
        this.channel.bind("onSetting", function(e){
            console.log('收到功能配置更改');
            if(e.data.target == 'self' && e.data.option == 'question'){
                singleEnable = e.data.enable;
            } else if(e.data.target == 'all' && e.data.option == 'question'){
                allEnable = e.data.enable;
            }

            if(singleEnable && allEnable){
                that.setData({
                    enable: true
                });
            } else {
                that.setData({
                    enable: false
                });
            }

        });

        this.checkClear = function(){
            var all = that.data.allList, flag = false;
            for(var k in all){
                if(all[k].unMove){
                    flag = true;
                    break;
                }
            }
            query.exec(function(res){
                console.log(res);
                if(res[0]){
                    that.setData({
                        scrollTop: res[0].height,
                        condition: flag
                    })
                }
            });
            that.setData({
                condition: flag
            })
        }

        this.numTen = function(m){
            return m>9?m:'0'+m;
        }
        this.qaid_in = function(arr, id){
            if(arr == 0){
                return false;
            }else{
                for(var i in arr){
                    if(arr[i]==id){
                        return true;
                    }
                }
                return false;
            }
        }
        
    },
    /**
    * 组件的方法列表
    */
    methods: {
        // _showAll: function(e){
        //     var id = e.currentTarget.dataset.id;
        //     if(this.data.currentId == id){
        //         this.setData({
        //             currentId: -1
        //         });
        //     } else {
        //         this.setData({
        //             currentId: id
        //         });
        //     }
            
        // },
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
                qaVal: val
            });
        },
        _sendQa: function(e){
            var that = this, val = this.data.qaVal, all = this.data.allList, enable = this.data.enable;
            var isSelf = this.data.isSelf, onlyMine = this.data.meList;
            clearTimeout(that.st);
            if(!enable){
                that.setData({
                    unChatText: "当前禁止问答，您的信息发送失败",
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

            
            this.channel.send("submitQuestion",{"content": val}, function(e){
                console.log("回调");
                if(e.result){
                    var uuid = e.data.id;
                    var obj = {
                        answer: '',
                        answerBy: '',
                        answerTime: '',
                        id: uuid,
                        question: val,
                        questionId: '',
                        submitor: "我",
                        questionowner: '我',
                        questionownerid: '',
                        questiontimestamp: 0,
                        removed: false,
                        unMove: true
                    }
                    var date = new Date();
                    var hours = date.getHours(), minutes = date.getMinutes(), seconds = date.getSeconds();
                    obj.time = that.numTen(hours) + ":" + that.numTen(minutes) + ":" + that.numTen(seconds);

                    that.qaid_old.push(uuid);
                    all.push(obj);
                    onlyMine.push(obj);

                    if(isSelf){
                        that.setData({
                            showList: onlyMine,
                            allList: all,
                            meList: onlyMine,
                            qaVal: '',
                            sendUrl: '../../assets/icons/send.png'
                        });
                    } else {
                        that.setData({
                            showList: all,
                            allList: all,
                            meList: onlyMine,
                            qaVal: '',
                            sendUrl: '../../assets/icons/send.png'
                        });
                    }
                    that.checkClear();
                } else {
                    that.setData({
                        unChatText: "发送过于频繁，请稍后再重试",
                        showUnchat: true
                    });
                    that.st = setTimeout(function(){
                        that.setData({
                            showUnchat: false
                        });
                    }, 3000);
                }
                
            });

            
            
        },
        _onlyMe: function(e){
            var isSelf = this.data.isSelf, onlyMine = this.data.meList, allMess = this.data.allList, that = this;
            clearTimeout(that.t);
            if(!isSelf){
                if(onlyMine.length > 0){
                    that.setData({
                        onlySelf: '../../assets/icons/onlyMe2.png',
                        isSelf: true,
                        showList: onlyMine
                    });
                } else {
                    that.setData({
                        onlySelf: '../../assets/icons/onlyMe2.png',
                        isSelf: true,
                        unChatText: "只看我的问答",
                        showUnchat: true,
                        showList: onlyMine
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
                    showList: allMess
                });
            }
        }
    }
})
