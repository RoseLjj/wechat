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
  ceshiUrl: tiUrl,
  // ceshiUrl:ceshiUrl,
  imgUrl,
  baseUrl,
  fileBaseUrl,
  morentoken: '$2y$10$y2cFbsE4O6lx88G24Y649udtHzIxbKnxss4Q65ZeRMbSTDUz0Flmi',
  game_list: 'game-list',//pk游戏列表
  game_user_rank: 'game-user-rank',//游戏中排行榜
  my_prop_list: 'my-prop-list', //我的道具列表
  game_begin_pick: 'game-begin-pick',//开始匹配
  game_over_list: 'game-over-list',//游戏结果页
};
module.exports = config
