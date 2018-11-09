// var requestTask;
// var requestUploadTask;
/**
 * Created by wupeitao on 16/8/22.
 */
/**
 * 排序参数 生成签名sign的值
 * @param arrArray 例如 ['post=我们1','user=b','cid=2','uuid=xxxxx'] 传递一个数组 函数会自动排序生成sign值
 * @returns {*}
 */
function sortParameter(arrArray) {
  if (arrArray.length == 0) {
    return false;
  }

  var str = arrArray.sort().join('&');
  str = DeCODE(str);

  var sign;

  var islogin = wx.getStorageSync('kydislogin');//读取登录状态
  var devicetoken = wx.getStorageSync('kydtoken');//token值
  if (islogin == 'false') {
    devicetoken = require('config.js').morentoken;
  } else {
    if (isNullOrEmpty(devicetoken)) {
      devicetoken = require('config.js').morentoken;
      // devicetoken = '$2y$10$broqirk45wynao8qidm2bu3bbg20xcrqk'; //正式版
      wx.setStorage({//存储token
        key: 'kydtoken',
        data: devicetoken
      })
    }
  }

  var keystring = str.toLowerCase() + devicetoken;
  console.log(keystring);
  var md5 = require('md5++.js');
  sign = md5.md5(keystring);
  console.log('sign==========' + sign);
  return sign;
}


/**
 * 判断是否为空
 * @param strVal
 * @returns {boolean}
 */
function isNullOrEmpty(strVal) {
  if (strVal == '' || strVal == null || strVal == undefined) {
    return true;
  } else {
    return false;
  }
}

//UUID获取
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;

}

/**
 * 将参数里的+改为%2B
 * @param str
 * @returns {string|void|XML|*}
 * @constructor
 */
function URICODE(str) {
  return str.replace(/\+/g, "%2B");
}
// 将参数里的%2B改为+
function DeCODE(str) {
  return str.replace(/(%2B)/g, "+");
}

//时间获取
function gettime() {
  var timestamp = parseInt(Date.parse(new Date())) / 1000;
  return timestamp;
}

/*文件上传参数----------------------------------------*/
function setUploadPrams(array) {
  // 读取 UUID
  var uuid = wx.getStorageSync('kyduuid');
  if (isNullOrEmpty(uuid)) {//如果 UUID为空 生成UUID
    uuid = generateUUID();
    wx.setStorage({//存储UUID
      key: 'kyduuid',
      data: uuid
    })
  }

  var islogin = wx.getStorageSync('kydislogin');//读取登录状态
  if (isNullOrEmpty(islogin)) {
    islogin = 'false';
    wx.setStorage({//存储登录状态
      key: 'kydislogin',
      data: islogin
    })
  }


  var accountType = wx.getStorageSync('kydaccountType');//读取登录状态
  if (isNullOrEmpty(accountType)) {
    accountType = '';
    wx.setStorage({//存储登录状态
      key: 'kydaccountType',
      data: accountType
    })
  }


  var prams = new Array();
  prams.push("uuid=" + uuid);
  prams.push("islogin=" + islogin);
  prams.push("accountType=" + accountType);
  prams.push("platform=mini");
  prams.push("time=" + gettime());

  for (var i = 0; i < array.length; i++) {
    prams.push(URICODE(array[i]));
  }

  var pramsobj = {};
  pramsobj.uuid = uuid;
  pramsobj.islogin = islogin;
  pramsobj.accountType = accountType;
  pramsobj.platform = 'mini';
  pramsobj.time = gettime();
  pramsobj.sg = sortParameter(prams);

  return pramsobj;
}

//文件上传
function fileNameUpload(filePath, callback) {
  var prams = setUploadPrams([]);
  console.log('参数。。。。。。。。。。。');
  console.log(prams);
  var baseUrl = require('config.js').baseUrl;
  var studentBatchUploadUrl = require('config.js').uploadFile;
  wx.uploadFile({
    url: baseUrl + studentBatchUploadUrl,
    filePath: filePath,
    name: 'file',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    formData: prams,
    success: function (res) {
      var data = JSON.parse(res.data);
      console.log(data);
      if (data.errorCode == 0) {
        callback(data);
      } else {
        wx.showToast({
          title: data.errorMessage,
          icon: 'none',
          duration: 2000
        })
        callback(data);
      }
    },
    fail: function ({ error }) {
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 2000
      })
      console.log('aaaaaaa' + error)
    }
  })
}


/*新的公用方法----------------------------------------*/
function setPrams(array) {
  // 读取 UUID
  var uuid = wx.getStorageSync('kyduuid');
  if (isNullOrEmpty(uuid)) {//如果 UUID为空 生成UUID
    uuid = generateUUID();
    wx.setStorage({//存储UUID
      key: 'kyduuid',
      data: uuid
    })
  }

  var islogin = wx.getStorageSync('kydislogin');//读取登录状态
  if (isNullOrEmpty(islogin)) {
    islogin = 'false';
    wx.setStorage({//存储登录状态
      key: 'kydislogin',
      data: islogin
    })
  }


  var accountType = wx.getStorageSync('kydaccountType');//读取登录状态
  if (isNullOrEmpty(accountType)) {
    accountType = '';
    wx.setStorage({//存储登录状态
      key: 'kydaccountType',
      data: accountType
    })
  }


  var prams = new Array();
  prams.push("uuid=" + uuid);
  prams.push("islogin=" + islogin);
  prams.push("accountType=" + accountType);
  prams.push("platform=mini");
  prams.push("time=" + gettime());

  for (var i = 0; i < array.length; i++) {
    prams.push(URICODE(array[i]));
  }
  prams.push("sg=" + sortParameter(prams));

  var pramsStr = '';
  for (var p = 0; p < prams.length; p++) {
    pramsStr = pramsStr + prams[p] + "&";
  }
  pramsStr = pramsStr.substring(0, pramsStr.length - 1);

  return pramsStr;
}

/** 网络请求接口
 * URL 接口
 * array 参数
 * callback 成功回调函数
 */
function initData(url, array, callback) {
  var prams = setPrams(array);
  console.log('post参数。。。。。。。。。。');
  console.log(prams);
  var baseUrl = require('config.js').baseUrl;
  wx.request({
    url: baseUrl + url,
    method: 'POST',
    data: prams,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log('结果1111111');
      console.log(res.data);
      if (res.data.errorCode == 0) {
        callback(res.data);
      } else {
        wx.showToast({
          title: res.data.errorMessage,
          icon: 'none',
          duration: 2000
        })
        // callback(res.data);
      }

    },
    fail: function ({ error }) {
      wx.showToast({
        title: '服务器异常',
        icon: 'none',
        duration: 2000
      })
      console.log('aaaaaaa' + error)
    }
  })

}



function cancelRequest() {
  requestTask.abort();
  requestUploadTask.abort();
}

/**
 * 秒转成 小时:分钟:秒
 * @param str
 * @returns {*}
 * @constructor
 */
function secToTime(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(0);
  }
  return t;
}


module.exports = {
  fileNameUpload: fileNameUpload,
  initData: initData,
  cancelRequest: cancelRequest,
  secToTime: secToTime,
}