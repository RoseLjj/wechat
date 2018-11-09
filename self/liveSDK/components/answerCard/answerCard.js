// components/answerCard/answerCard.js
const app = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        oldData: {
            type: Object
        },
        currentItem0: {
            type: Array,
            value: []
        },
        currentItem1: {
            type: Array,
            value: []
        },
        currentItem2: {
            type: Array,
            value: []
        },
        resultItem: {
            type: Array,
            value: []
        },
        isShowCard: {
            type: Boolean,
            value: false
        },
        isShowRight: {
            type: Boolean,
            value: false
        },
        isResult: {
            type: Boolean,
            value: false
        },
        type: {
            type: Number,
            value: 1
        },
        multiUrl: {
            type: String,
            value: '../../assets/icons/multiple.png'
        },
        multiUrl2: {
            type: String,
            value: '../../assets/icons/multiple2.png'
        },
        judeg1: {
            type: String,
            value: '../../assets/icons/ansCardRight.png'
        },
        judeg2: {
            type: String,
            value: '../../assets/icons/ansCardWrong.png'
        }

        
    },

    /**
     * 组件的初始数据
     */
    data: {
        subTitle: '',
        subRight: '',
        resultType: 0,//回答的3状态 0 没有答案 1 回答正确 2 回答错误
        rightShow: false,//显示右边小图标
        hasReal: false, //是否显示“正确”
        ansTeacher: '',//老师的答案
        ansMine: ''//我的答案
    },
    ready: function(){
        var that = this;
        this.channel = app.globalData.channel;
        this.channel.bind("onAnswerSheet", function(e){
            console.log("收到答题卡");
            
            var questions = e.data.questions,
                id = e.data.id;

            for(var i = 0; i < questions.length; i++){
                if(questions[i].type == 'single'){
                    if(questions[i].items.length == 2){
                        that.setData({
                            currentItem2: questions[i].items,
                            type: 2
                        });
                    } else {
                        that.setData({
                            currentItem0: questions[i].items,
                            type: 0
                        });
                    }
                } else if(questions[i].type == 'multi'){
                    that.setData({
                        currentItem1: questions[i].items,
                        type: 1
                    });
                }
            }

            that.setData({
                subTitle: '题干部分请留意PPT或者老师语言描述',
                subRight: '',
                oldData: e.data,
                isResult: false,
                isShowCard: true
            });

        });
        this.channel.bind("onAnswerSheetAnswer", function(e){
            console.log("收到答题卡答案");
            var question = e.data.question,
                id = e.data.id;

            for(var i = 0; i < question.length; i++){
                var items = question[i].items, flag = false, ansTeacher = '', subTitle, ansMine = that.data.ansMine, resultType = 0;
                for(var k =0; k < items.length; k++){
                    if(items[k].correct == "true") {
                        flag = true;
                        ansTeacher += items[k].content;
                    }
                    if(question[i].total == 0){
                        items[k].persent = 0;
                    } else {
                        items[k].persent = Math.round(items[k].total / question[i].total * 100);
                    }
                }

                if(ansTeacher != ''){
                    subTitle = '老师的答案：'+ansTeacher;
                }

                if(ansMine != '' && subTitle != ''){
                    subTitle += '&nbsp;&nbsp;&nbsp;我的答案：'+ansMine;
                } else if(ansMine != '' && subTitle == ''){
                    subTitle += '我的答案：'+ansMine;
                }

                if(ansTeacher == '') {
                    resultType = 0;
                } else if(ansMine == ansTeacher) {
                    resultType = 1;
                } else if(ansMine != ansTeacher ) {
                    resultType = 2;
                }

                that.setData({
                    subTitle: subTitle,
                    subRight: '共有'+question[i].total+'人作答',
                    resultItem: items,
                    isResult: true,
                    isShowCard: true,
                    hasReal: flag,
                    ansTeacher: ansTeacher,
                    resultType: resultType
                });
            }

        });
    },
    /**
     * 组件的方法列表
     */
    methods: {
        chooseAns: function(e){
            var id = e.currentTarget.dataset.id, that = this, allArray = that.data.currentItem0;
            for(var k in allArray){
                if(allArray[k].id == id){
                    allArray[k].selected = true;
                } else {
                    allArray[k].selected = false;
                }
            }

            this.setData({
                currentItem0: allArray,
            });
        },
        chooseMulti: function(e){
            var id = e.currentTarget.dataset.id, that = this, allArray = that.data.currentItem1;
            for(var k in allArray){
                if(allArray[k].id == id){
                    allArray[k].selected = !allArray[k].selected;
                }
            }
            
            this.setData({
                currentItem1: allArray
            });
        },
        chooseBoolean: function(e){
            var id = e.currentTarget.dataset.id, that = this, allArray = that.data.currentItem2;
            for(var k in allArray){
                if(allArray[k].id == id){
                    allArray[k].selected = true;
                } else {
                    allArray[k].selected = false;
                }
            }
            this.setData({
                currentItem2: allArray
            });
        },
        changeAnscard: function(){
            this.setData({
                isShowCard: !this.data.isShowCard,
                isShowRight: !this.data.isShowRight
            })
        },
        closeCard: function(){
            this.setData({
                isShowCard: false,
                isShowRight: false
            })
        },
        submitCard: function(){
            var type = this.data.type, oldData = this.data.oldData, that = this, ansMine = '';
            if(type == 0){
                oldData.questions[0].items = that.data.currentItem0;
            } else if(type == 1){
                oldData.questions[0].items = that.data.currentItem1;
            } else if(type == 2){
                oldData.questions[0].items = that.data.currentItem2;
            }
            for(var i = 0; i < oldData.questions[0].items.length; i++){
                if(oldData.questions[0].items[i].correct == 'true'){
                    ansMine += oldData.questions[0].items[i].content;
                }
            }
            this.channel.send('submitVote', [oldData]);
            this.setData({
                isShowCard: false,
                isShowRight: false,
                ansMine: ansMine
            })
        }
    }
})
