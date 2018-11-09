// 接口配置文档

//正式
// var baseUrl = 'https://www.guangheyingyu.com/gh/g3/';
// var fileBaseUrl = 'https://www.guangheyingyu.com/smallwx';
// let imgUrl = 'https://www.guangheyingyu.com/'; //正式


//测试
var baseUrl = 'http://student.ryit.co/gh/g3/';
var fileBaseUrl = 'http://img.test.ryit.co';
let imgUrl = 'http://student.ryit.co/'; //测试
let tiUrl = 'http://student.ryit.co/student/';
let ceshiUrl = 'http://6veta4.natappfree.cc/'

var config = {
  ceshiUrl:tiUrl,
  // ceshiUrl:ceshiUrl,
  imgUrl,
  baseUrl,
  fileBaseUrl,
  morentoken: '$2y$10$y2cFbsE4O6lx88G24Y649udtHzIxbKnxss4Q65ZeRMbSTDUz0Flmi',
  subjectList: 'study-room-subject-list',//获得自习室科目列表
  examineType: 'get-examine-type-by-kemu', //根据科目获取题型 参数 id 科目id
  zikemuList: 'get-zikemu-by-examine-type',//根据科目和题型获取子科目 参数 id 科目id  type 1 单题 2 套题
  examineListThree: 'examine-list-three',//试题列表 
  examine_report: 'examine-report', //答题报告
  examine_target_fraction: 'examine-target-fraction',//修改目标分数
  examineCollectionList: 'examine-collection-list',//收藏列表
  examine_question_no: 'examine-question-no',//题号列表
  apply_correct_two:'apply-correct-two',//申请批改
  examine_correct_record: 'examine-correct-record', //批改记录 (answer_id)
  comprehensive_score: 'examine-comprehensive-score', //试卷综合得分（试卷中雅思、托福、ACT才有）
  
  classListMini: 'class-list-mini',//教室 今日课程
  uploadFile : "upload-file", // 上传图片接口
  uploadWork: "upload-work",// 学生提交作业
  studentFeekback: "student-feekback",  //学生提交评价
  popuprecord: "pop-up-record", // 教师弹框记录
  smallprogramTaskList: "smallprogram-task-list",//任务列表 1 登录任务  2 日常任务
  receiveSmallprogramTask: "receive-smallprogram-task",//领取小程序任务
  userRank:"user-rank",//榜单 1，成绩榜 2，活跃榜 3，竞技榜
  classList: "small-class-base-list", //选课列表
  investigationList: "small-investigation-list",//问卷调查
  classSubjectList:"class-subject-list",//课程列表
  saveInvestigation: 'user-save-small-investigation',//保存用户问题
  classSubjectTypeList: "class-subject-type-list",//获取选课中心子科目列表
  classInfo: "class-info",//课程详情
};
module.exports = config
