// 接口配置文档

var baseUrl = 'https://www.guangheyingyu.com/mini/v1/';
var fileBaseUrl = 'https://www.guangheyingyu.com/smallwx';

// var baseUrl = 'http://student.ryit.co/mini/v1/';
// var fileBaseUrl = 'http://img.test.ryit.co';


var config = {
  baseUrl,
  fileBaseUrl,
  morentoken: '$2y$10$y2cFbsE4O6lx88G24Y649udtHzIxbKnxss4Q65ZeRMbSTDUz0Flmi',
  loginUrl: 'task-login',//登录
  getCodeUrl: 'user-code',//获取验证么
  verifyCodeUrl: 'verify-code',//验证手机验证码
  captchaUrl: 'captcha',//图形验证码
  checkVerifyCodeUrl: 'check-verify-code',//验证图形验证码
  resetPassUrl: 'reset-pass',//设置密码
  studentIndexUrl: 'student-index',//学生首页
  studentNoticeInfoUrl: 'student-notice-info',//学生首页小红点
  adsBannerListUrl: 'guang-list',//banner显示
  studentFindTaskUrl: 'student-find-task',//作业详情
  studentBatchUploadUrl: 'student-batch-upload',//上传接口
  deleteAudioUrl: 'delete-audio',//删除文件
  studentUploadTaskUrl: 'student-upload-task',//保存作业
};
module.exports = config
