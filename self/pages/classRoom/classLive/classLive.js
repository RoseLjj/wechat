// index.js
// 获取应用实例
const app = getApp();

const zrhelper = require('../../../liveSDK/sdk/zrender-helper');
const zrender = require("../../../liveSDK/sdk/zrender");

const LIVE = require("../../../liveSDK/sdk/live");
const GSSDK = require("../../../liveSDK/sdk/gssdk");
const GS = GSSDK.GS;

var subjectItem = {
  "id": "",
  "title": "",
  "status": 1,
  "num": 1,
  "pic": parseInt(Math.random() * 4 + 1),
  "ctx": "training",
  "userid": '',
  "username": '',
  "authcode": '',
  "site": 'ghyy.gensee.com',
};

var pointer = "", pointer1 = "", cansObject = {};
Page({
	data: {
        joinItem: '',//加入设置各种参数
        showBar: false,//textarea上面完成一栏是否显示
        videoHeight: 205,//视频高度
        swiperHeight: 500,//下面滑动高度
        canvasHeight: 0,//canvas高度
        docHeight: 0,//文档高度
        pointer_show: 0,//
        pointer: "",
        pointer1: "",

        current: 0,//切换状态
        condition: false,//是否有canvas

        audioSrc:"",//语音地址
        videoSrc: "",//视频地址
        playSrc: "",//播放地址
        controls: false,//视频控制
        autoplay: true,//自动播放
        playStatus: "未开始",//当前状态
        showVideo: false,//是否显示video标签(不能用wx:if)
        vTips: false,//是否显示状态栏
        playNum: 0,//当前人数
        changeScreenImg: "../../../liveSDK/assets/icons/fullScreen.png",//切换全屏图标
        isFullScreen: false,//是否全屏

        isVideo: true,//是否视频
        changeVideoImg: "../../../liveSDK/assets/icons/closeVideo.png",//切换视频、音频图标

        pptArray: [],//标注数据
        documentUrl: '',//文档地址

        isShowQnaire: false,//是否显示问卷
        voteList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],

        voteSingleSel: '../../../liveSDK/assets/icons/single.png',
        voteSingleSel2: '../../../liveSDK/assets/icons/single2.png',
        voteSingleSel3: '../../../liveSDK/assets/icons/single3.png',
        voteMultSel: '../../../liveSDK/assets/icons/multiple.png',
        voteMultSel2: '../../../liveSDK/assets/icons/multiple2.png',
        voteMultSel3: '../../../liveSDK/assets/icons/multiple3.png',
        voteAll: [],//接收到的问卷

    },
    onLoad:function(options){
        this.channel = GS.createChannel();
        app.globalData.channel = this.channel;
        // 页面初始化 options为页面跳转所带来的参数
        var item = JSON.parse(options.item);
        subjectItem.title = item.title;
        subjectItem.id = item.id;
        subjectItem.authcode = item.authcode;
        subjectItem.username = item.username;
        console.log(subjectItem);
        if (subjectItem){
            this.setData({
              joinItem: subjectItem//JSON.parse(subjectItem)
            });
        }

    },
    onShow: function(){
        if(this.videoContext){
            this.videoContext.play();
        }
    },
    onReady: function (res) {
        var that = this;

        this.videoContext = wx.createVideoContext('myVideo');

        var winHeight = wx.getSystemInfoSync().windowHeight, winWidth = wx.getSystemInfoSync().windowWidth;
        var vidHeight = winWidth * 9 / 16;
        var swpHeight = winHeight - 44 - 64 - vidHeight;

        this.setData({
            videoHeight: vidHeight,
            swiperHeight: swpHeight
        });

        this.scale = winWidth/1024;

        if(this.zr){
            this.zr.dispose();
        }
        this.zr = zrhelper.createZrender("drawCanvas", winWidth, swpHeight);
        cansObject = {};
        

        //视频URL
        this.channel.bind("onVideoUrl", function(e){
            that.setData({
                videoSrc: e.data,
                playSrc: e.data
            });
            console.log("视频URL:"+e.data);
        });

        //音频URL
        this.channel.bind("onAudioUrl", function(e){
            that.setData({
                audioSrc: e.data
            });
            console.log("音频URL:"+e.data);
        });

        //直播状态
        this.channel.bind("onStart", function(){
            that.setData({
                playStatus: '直播中',
                showVideo: true
            });
            that.videoContext.play();
        });
        this.channel.bind("onPause", function(){
            that.setData({
                playStatus: '已暂停',
                showVideo: true
            });
            that.videoContext.play();
        });
        this.channel.bind("onPlay", function(){
            that.setData({
                playStatus: '直播中',
                showVideo: true
            });
            that.videoContext.play();
        });
        this.channel.bind("onStop", function(){
            that.setData({
                playStatus: '已结束',
                showVideo: false,
                playSrc: ''
            });
        });

        //直播标题
        this.channel.bind("onTitle", function(e){
            console.log("直播标题");
            var title = e.data.content;
            wx.setNavigationBarTitle({title: title});
        });

        //在线人数
        this.channel.bind("onUserOnline", function(e){
            console.log("在线人数");
            var count = e.data.count;
            that.setData({
                playNum: count
            });
            
        });

        //被踢出 
        this.channel.bind("onKickOut", function(e){
            console.log("被踢出");
            wx.showModal({
                title: '提示',
                content: '您已被管理员请出本次活动',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#0078d7'
            });
            var t = setTimeout(function(){
                wx.navigateBack({
                    delta: 1
                })
            }, 3000);
        });

        //历史标注
        this.channel.bind("onInitAnno", function(e){
            var list = e.data, ppt = that.data.pptArray;
            for(var i = 0; i < list.length; i++){
                ppt.push(list[i]);
            }
            that.setData({
                pptArray: ppt
            });
            that.drawCanvas(list, that.scale);
        });

        //收到标注
        this.channel.bind("onAnnotation", function(e){

            console.log("收到标注");
            var list = e.data.annoArray, ppt = that.data.pptArray, drawList = [];
            for(var i = 0; i < list.length; i++){
                if(!that.inPptArr(list[i].id)){
                    ppt.push(list[i]);
                    drawList.push(list[i]);
                }
            }
            that.setData({
                pptArray: ppt
            });
            that.drawCanvas(drawList, that.scale);

        });

        //清空标注
        this.channel.bind("onAnnoClear", function(e){
            console.log("清空标注");
            that.clearAnno();
        });

        //文档
        // this.channel.bind("onDocument", function(e){
        //     console.log("收到文档");
        //     var height = e.data.height, width = e.data.width;
        //     var s = height / width;
        //     var nHeight = wx.getSystemInfoSync().windowWidth * s;

        //     that.scale = wx.getSystemInfoSync().windowWidth / width;
        //     that.setData({
        //         documentUrl: e.data.hls,
        //         docHeight: nHeight,
        //         canvasHeight: nHeight
        //     });

        // });

        //文档翻页
        this.channel.bind("onDocChange", function(e){
            console.log("收到文档翻页");
            that.clearAnno();
            var height = e.data.height, width = e.data.width;
            var s = height / width;
            var nHeight = wx.getSystemInfoSync().windowWidth * s;

            that.scale = wx.getSystemInfoSync().windowWidth / width;
            that.setData({
                documentUrl: e.data.hls,
                docHeight: nHeight,
                canvasHeight: nHeight,
                condition: true
            });
        });

        //问卷调查
        this.channel.bind("onVote", function(e){
            console.log("收到调查问卷");
            var content = e.data, voteAll = that.data.voteAll, voteTitle, skip, items;

            if(!that.voteId_in(voteAll, content.id)){
                for(var j = 0; j < content.questions.length; j++){
                    content.questions[j].answer = '';
                }
            };
            content.type = 'question';
            voteAll.push(content);
                
            that.setData({
                voteAll: voteAll,
                isShowQnaire: true
            });
        });
        //收到调查问卷结果
        this.channel.bind("onVoteResult", function(e){
            console.log("收到调查问卷结果");
            var content = e.data, voteAll = that.data.voteAll, voteTitle, skip, items, total, showTrue = false;
            if(!that.voteId_in(voteAll, content.id)){
                items = content.questions;
                for(var j = 0; j < items.length; j++){
                    if(items[j].items){
                        for(var m = 0; m < items[j].items.length; m++){
                            if(items[j].items[m].correct == 'true'){
                                content.showTrue = true;
                                break;
                            }
                        }
                    }
                    if(content.showTrue){
                        break;
                    }
                }
                content.type = 'publish';
                voteAll.push(content);
            };
            that.setData({
                voteAll: voteAll,
                isShowQnaire: true
            });
        }); 


        //sdk状态通知
        this.channel.bind("onStatus", function(e){
            console.log('SDK状态通知');
            var content = '';
            if(e.data.type == '1'){
                content = '直播间人数已满，您无法加入';
            } else if(e.data.type == '4'){
                content = '服务器拒绝，加入失败';
            } else if(e.data.type == '7'){
                content = '直播间已上锁，拒绝加入';
            } else if(e.data.type == '8'){
                content = '您无权进入该活动';
            }

            if(e.data.type == '1' || e.data.type == '8'){
                wx.showModal({
                    title: '提示',
                    content: content,
                    showCancel: false,
                    confirmText: '我知道了',
                    confirmColor: '#0078d7'
                });
            }
        });

        //监听报错
        this.channel.bind("onAPIError", function(e){
          console.log('报错');
          console.log(e.data);
            wx.showModal({
                title: 'ERROR',
                content: e.data.explain,
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#0078d7'
            });
        });

        this.inPptArr = function(id){
            var pptArr = that.data.pptArray;
            for(var k = 0; k < pptArr.length; k++){
                if(id == pptArr[k].id){
                    return true;
                }
            }
            return false;
        }


        LIVE.init({
            "site": that.data.joinItem.site,
            "ownerid": that.data.joinItem.id,
            "ctx": that.data.joinItem.ctx,
            "authcode": that.data.joinItem.authcode, 
            "uid": '', 
            "uname": that.data.joinItem.username,
            "encodetype": '',
            "password": '',
            "stream": '',
            // "istest": 'true'
        }, function(e){
            console.log("回调");
            // app.globalData.userInfo.userid = e.userid;
        });
    },
    onUnload: function(res){
        LIVE.refresh();
    },
    createArrowHead: function(pos, color, size){
        var headLength = 5,
            x1 = parseInt(pos[0]),
            y1 = parseInt(pos[1]),
            x2 = parseInt(pos[2]),
            y2 = parseInt(pos[3]),

            dx = x2 - x1,
            dy = y2 - y1,

            x3, y3, x4, y4, midx, midy,
            angle = Math.atan2(dy, dx);

        angle *= 180 / Math.PI;
        var angle1 = (angle + 30) * Math.PI / 180, 
            angle2 = (angle - 30) * Math.PI / 180;


        x3 = x2 - Math.cos(angle1) * headLength;
        y3 = y2 - Math.sin(angle1) * headLength;

        x4 = x2 - Math.cos(angle2) * headLength;
        y4 = y2 - Math.sin(angle2) * headLength;

        var polygon = new zrender.Polygon({
            shape: {
                points: [[x2, y2], [x3, y3], [x4, y4]],
                smooth: false
            },
            style: {
                fill: color,
                stroke: color,
                lineWidth: size
            }
        });

        return polygon;
    },
    drawCanvas: function(data, scale){
        var that = this, scale = scale;
        var all = data;

        for(var i = 0; i < all.length; i++){
            if(all[i].color != null){
                var color_arr=all[i].color.split(',');
                var color=color_arr[0];
                var opacity=parseFloat(color_arr[1]);
            }

            if(that.data.pointer_show>0){
                if(all[i].type==9 || all[i].type==1){
                    if((all[i].style == '0' && that.data.pointer_show != 2) || (all[i].style == '1' && that.data.pointer_show != 1)){
                        if(that.data.pointer_show==1){
                            pointer.setStyle({x: -100, y: -100});
                        }else{
                            pointer1.setStyle({x: -100, y: -100});
                        }
                    }
                }  else {
                    if(that.data.pointer_show==1){
                        pointer.setStyle({x: -100, y: -100});
                    }else{
                        pointer1.setStyle({x: -100, y: -100});
                    }
                    that.setData({
                        pointer_show: 0
                    });
                }
            }

            if(all[i].type == 6){
                //矩形
                all[i].start_p=all[i].p.split(',');
                all[i].end_p=all[i].ep.split(',');
                var width = parseInt(all[i].end_p[0])-parseInt(all[i].start_p[0]);
                var height = parseInt(all[i].end_p[1])-parseInt(all[i].start_p[1]);
                var linesize = parseInt(all[i].linesize) * scale;

                var rect = new zrender.Rect({           
                    shape: {
                        x: parseInt(all[i].start_p[0]) * scale,
                        y: parseInt(all[i].start_p[1]) * scale,
                        width: parseInt(width * scale),
                        height: parseInt(height * scale)
                    },
                    style: {
                        fill: null,
                        stroke: color,
                        lineWidth: linesize
                    }
                });
                cansObject[all[i].id] = rect;
                that.zr.add(rect);
            
            } else if(all[i].type == 5){
                //椭圆
                all[i].start_p=all[i].p.split(',');
                all[i].end_p=all[i].ep.split(',');
                var width = parseInt(all[i].end_p[0])-parseInt(all[i].start_p[0]);
                var height = parseInt(all[i].end_p[1])-parseInt(all[i].start_p[1]);
                var linesize = parseInt(all[i].linesize) * scale;

                var ellipse = new zrender.Ellipse({           
                    shape: {
                        cx: (parseInt(all[i].start_p[0]) + parseInt(all[i].end_p[0])) / 2 * scale,
                        cy: (parseInt(all[i].start_p[1]) + parseInt(all[i].end_p[1])) / 2 * scale,
                        rx: parseInt(width / 2 * scale),
                        ry: parseInt(height / 2 * scale)
                    },
                    style: {
                        fill: null,
                        stroke: color,
                        lineWidth: linesize
                    }
                });
                cansObject[all[i].id] = ellipse;
                that.zr.add(ellipse);
            } else if(all[i].type==4 && all[i].value){
                // 文字
                console.log("写文字");
                all[i].start_p=all[i].p.split(',');
                all[i].end_p=all[i].ep.split(',');
                var fontsize = parseInt(all[i].fontsize * scale) ;
                var value = all[i].value;

                var text = new zrender.Text({
                    style: {
                        x: parseInt(all[i].start_p[0]) * scale,
                        y: parseInt(all[i].start_p[1]) * scale,
                        text: value,
                        textFill: color,
                        // textStroke: color,
                        textFont: fontsize + 'px Microsoft Yahei',
                        textBaseline: 'top'
                    }
                });
                cansObject[all[i].id] = text;
                that.zr.add(text);

            } else if(all[i].type==3){
                if(all[i].removed==0){//清屏
                    // zr.refreshImmediately();
                    //zr.refresh();//window.resize时宽高变化
                    // zr.dispose();摧毁
                    // that.zr.clear();
                    // cansObject = {};
                    that.clearAnno();
                } else {
                    var id = all[i].removed;
                    if(cansObject[id] && cansObject[id] != null){
                        that.zr.remove(cansObject[id]);
                    }
                    cansObject[id] = null;
                    
                }
            } else if(all[i].type == '8' || all[i].type == '7'){
                //线条
                all[i].start_p=all[i].p.split(',');
                all[i].end_p=all[i].ep.split(',');
                var linesize = parseInt(all[i].linesize) * scale;

                if(all[i].style == '0' || all[i].type == '7'){
                    //直线
                    var line1 = new zrender.Line({
                        shape: {
                            x1: parseInt(all[i].start_p[0]) * scale,
                            y1: parseInt(all[i].start_p[1]) * scale,
                            x2: parseInt(all[i].end_p[0]) * scale,
                            y2: parseInt(all[i].end_p[1]) * scale
                        },
                        style: {
                            lineCap: "round",                   
                            lineWidth: linesize,
                            stroke: color,
                            lineDash: null
                        }

                    });

                    cansObject[all[i].id] = line1;
                    that.zr.add(line1);
                } else if(all[i].style == '1'){
                    // 虚线
                    console.log("虚线");
                    var line2 = new zrender.Line({
                        shape: {
                            x1: parseInt(all[i].start_p[0]) * scale,
                            y1: parseInt(all[i].start_p[1]) * scale,
                            x2: parseInt(all[i].end_p[0]) * scale,
                            y2: parseInt(all[i].end_p[1]) * scale
                        },
                        style: {
                            lineCap: "butt",                   
                            lineWidth: linesize,
                            stroke: color,
                            lineDash: [2, 2]
                        }

                    });

                    cansObject[all[i].id] = line2;
                    that.zr.add(line2);
                    
                } else if(all[i].style == '2'){
                    // 箭头  
                    console.log("有箭头线条");
                    var arrow = that.createArrowHead([all[i].start_p[0] * scale, all[i].start_p[1] * scale, all[i].end_p[0] * scale, all[i].end_p[1] * scale], color, linesize * scale);
                    var line3 = new zrender.Line({
                        shape: {
                            x1: parseInt(all[i].start_p[0]) * scale,
                            y1: parseInt(all[i].start_p[1]) * scale,
                            x2: parseInt(all[i].end_p[0]) * scale,
                            y2: parseInt(all[i].end_p[1]) * scale
                        },
                        style: {
                            lineCap: "round",
                            lineWidth: linesize,
                            stroke: color,
                            fill: color
                        }

                    });

                    cansObject[all[i].id] = [line3, arrow];
                    that.zr.add(line3);
                    that.zr.add(arrow);
                }
            } else if(all[i].type == 2){
                // 自由笔

                var linesize = parseInt(all[i].linesize) * scale;

                var p = all[i].p, s_p = new Array;
                for(var m = 0; m < p.length;m++){
                    p[m] = p[m].split(",");
                }
                for (var j = 0; j < p.length; j++) {
                    s_p.push([parseInt(p[j][0])*scale, parseInt(p[j][1])*scale]);
                }
                if(opacity < 1){
                    opacity = 0.75;
                }
                
                var line4 = new zrender.Polyline({
                    style: {
                        lineDash: [0, 0],
                        opacity: opacity,
                        stroke: color,
                        lineWidth: linesize
                    },
                    shape: {
                        points: s_p,
                        smooth: 0.5
                    }
                });

                cansObject[all[i].id] = line4;
                that.zr.add(line4);
            } else if(all[i].type == 9 || all[i].type == 1){
                //激光笔
                var start_p = all[i].p.split(",");
                if(all[i].style && all[i].style==1 && pointer==""){
                    var image = new zrender.Image({
                        style: {
                            x: parseInt(start_p[0]) * scale,
                            y: parseInt(start_p[1]) * scale,
                            image: '../../../liveSDK/assets/icons/point.png',
                            width: 16,
                            height: 16,
                            text: ''
                        }
                    });
                    that.zr.add(image);
                    pointer = image;
                } else if(all[i].style && all[i].style==0 && pointer1==""){
                    var image = new zrender.Image({
                        style: {
                            x: parseInt(start_p[0]) * scale,
                            y: parseInt(start_p[1]) * scale,
                            image: '../../../liveSDK/assets/icons/pointEx.png',
                            width: 16,
                            height: 16,
                            text: ''
                        }
                    });
                    that.zr.add(image);
                    pointer1 = image;
                } else {
                    if(all[i].style && all[i].style==1){
                        pointer.setStyle({x: parseInt(start_p[0]) * scale, y: parseInt(start_p[1]) * scale});
                    }else{
                        pointer1.setStyle({x: parseInt(start_p[0]) * scale, y: parseInt(start_p[1]) * scale});
                    }
                }

                if(all[i].style && all[i].style==1){
                    that.setData({
                        pointer_show: 1
                    });
                }else{
                    that.setData({
                        pointer_show: 2
                    });
                }

            }

        }
        
    },
    clearAnno: function(){
        var that = this, arr = [];
        for(var k in cansObject){
            if(cansObject[k] && cansObject[k] != null){
                arr.push(cansObject[k]);
                that.zr.remove(cansObject[k]);
            }
        }
        // that.zr.refresh();
        // that.zr.clear(arr);
        cansObject = {};
        that.setData({
            pptArray: []
        });
    },
    swiperDemo1: function(){
        this.setData({
            current: 0
        });
    },
    swiperDemo2: function(){
        this.setData({
            current: 1
        });
    },
    swiperDemo3: function(){
        this.setData({
            current: 2
        });
    },
    vTipsClear: function(){
        let that = this;
        this.setData({
            vTips: !that.data.vTips
        });
    },
    showPoint: function(){
        wx.showModal({
            title: '提示',
            content: '直播人数已满，您无法加入',
            showCancel: false,
            confirmText: '我知道了',
            confirmColor: '#0078d7',
            success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
            }
        });
    },
    changeScreen: function(){
        var changeSrc, showVideo = this.data.showVideo;
        if(showVideo){
            if(this.data.isFullScreen){
                this.videoContext.exitFullScreen();
                changeSrc = "../../../liveSDK/assets/icons/fullScreen.png"
            } else {
                this.videoContext.requestFullScreen();
                changeSrc = "../../../liveSDK/assets/icons/smallScreen.png";
            }
            this.setData({
                isFullScreen: !this.data.isFullScreen,
                changeScreenImg: changeSrc
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '直播未开始，不可切换',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#0078d7'
            });
        }
        
        
    },
    changeVideo: function(){
        var changeSrc, playSrc, showVideo = this.data.showVideo;
        if(showVideo){
            if(this.data.isVideo){
                changeSrc = "../../../liveSDK/assets/icons/openVideo.png";
                playSrc = this.data.audioSrc;
            } else {
                changeSrc = "../../../liveSDK/assets/icons/closeVideo.png";
                playSrc = this.data.videoSrc;
            }
            this.setData({
                isVideo: !this.data.isVideo,
                changeVideoImg: changeSrc,
                playSrc: playSrc
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '直播未开始，不可切换',
                showCancel: false,
                confirmText: '我知道了',
                confirmColor: '#0078d7'
            });
        }
        
    },
    timeupdate: function(event){
        app.globalData.currentTime = event.detail.currentTime;
    },
    canvasFull: function(event){

        console.log('canvasFull');
    },
    singleTap: function(e){
        var id = e.currentTarget.dataset.id, qaid = e.currentTarget.dataset.qaid, that = this, allArray = that.data.voteAll, item;
        for(var i = 0; i < allArray.length; i++){
            item = allArray[i].questions;
            for(var j = 0; j < item.length; j++){
                var questions = item[j];
                if(questions.type == 'single' && questions.id == qaid){
                    for(var k = 0; k < questions.items.length; k++){
                        if(questions.items[k].id == id){
                            questions.items[k].selected = true;
                            questions.answer = (k+1+'');
                        } else {
                            questions.items[k].selected = false;
                        }
                    }
                }
            }
        }
        this.setData({
            // voteItems: item,
            voteAll: allArray
        });

    },
    multTap: function(e){
        var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll, item;
        for(var i = 0; i < allArray.length; i++){
            item = allArray[i].questions;
            for(var j = 0; j < item.length; j++){
                var questions = item[j];
                if(questions.type == 'multi'){
                    questions.answer = '';
                    for(var k = 0; k < questions.items.length; k++){
                        if(questions.items[k].id == id){
                            questions.items[k].selected = !questions.items[k].selected;
                        }
                        if(questions.items[k].selected){
                            questions.answer += (k+1+',');
                        }
                    }
                    questions.answer = questions.answer.substring(0, questions.answer.length-1);
                }
            }
        }

        this.setData({
            // voteItems: item,
            voteAll: allArray
        });
    },
    textInput: function(e){
        var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll, item;
        var val = e.detail.value;
        for(var i = 0; i < allArray.length; i++){
            item = allArray[i].questions;
            for(var j = 0; j < item.length; j++){
                if(item[j].type == 'text' && item[j].id == id){
                    item[j].answer = val;
                }
            }
        }

        this.setData({
            // voteItems: item,
            voteAll: allArray
        });

    },
    subVote: function(e){
        var that = this, allArray = that.data.voteAll, id = e.currentTarget.dataset.id, itemArray, flag = false;
        for(var j = 0; j < allArray.length; j++){
            if(allArray[j].id == id){
                for(var n = 0; n < allArray[j].questions.length; n++){
                    var items = allArray[j].questions[n].items;
                    if(items){
                        for(var m = 0; m < items.length; m++){
                            if(items[m].correct == 'true'){
                                flag = true;
                                break;
                            }
                        }
                    }
                    if(flag) break;
                }
                if(allArray[j].skip == 'false'){//强制投票的判断
                    for(var k = 0; k < allArray[j].questions.length; k++){
                        if(allArray[j].questions[k].answer == ''){
                            wx.showModal({
                                title: '提示',
                                content: '强制投票需要回答完所有题目',
                                showCancel: false,
                                confirmText: '我知道了',
                                confirmColor: '#0078d7'
                            });
                            return false;
                        }
                    }
                }

                itemArray = allArray[j];
                if(flag){
                    allArray[j].showAns = true;
                } else {
                    allArray.splice(j, 1);
                }
                break;
            }
        }
        // itemArray.rootType = 'vote';
        this.channel.send("submitVote", itemArray);
        if(allArray.length == 0){
            this.setData({
                voteAll: allArray,
                isShowQnaire: false
            });
        } else {
            this.setData({
                voteAll: allArray
            });
        }
        
    },
    closeNaire: function(e){
        var id = e.currentTarget.dataset.id, that = this, allArray = that.data.voteAll;
        for(var j = 0; j < allArray.length; j++){
            if(allArray[j].id == id){
                allArray.splice(j,1);
                break;
            }
        }
        if(allArray.length == 0){
            this.videoContext.play();
            this.setData({
                voteAll: allArray,
                isShowQnaire: false
            });

        } else {
            this.setData({
                voteAll: allArray
            });
        }
        
    },
    voteId_in: function(arr, id){
        if(arr.length == 0){
            return false;
        }else{
            for(var i in arr){
                if(arr[i].id==id){
                    return true;
                }
            }
            return false;
        }
    },
    playVideo: function(e){
        LIVE.toldPlay();
        LIVE.initBindPlaying();
        LIVE.initBindPlay();
        var isShowQnaire = this.data.isShowQnaire;
        this.setData({
            isShowQnaire: isShowQnaire
        })
    },
    pauseVideo: function(e){
        LIVE.initBindPause();
    },
    waitVideo: function(e){
        LIVE.initBindWaiting();
        console.log("等待是曼城的");
    },
    endVideo: function(e){
        LIVE.initBindEnded();
    },
    backReturn: function () {
      wx.navigateBack({
        delta: 1
      })
    }

});