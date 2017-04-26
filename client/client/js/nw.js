/**
 * Created by libinqi on 2015/5/26.
 */
if (window.require) {
  window.gui = require('nw.gui');
  var win = gui.Window.get();
  var exec = require('child_process').exec;
  var fs = require('fs');
  var path = require('path');
  var async = require('async');
  var wrcard = require('node-wrcard');
  var termb = require('node-termb');
  var dahua_client = require('node-dahua');
  var app_config=require(process.cwd() + '/appconfig.json');
  var isMaxWindow = false;

  //    win.setMinimumSize(1024, 728);

  function Maximize() {
    if (!isMaxWindow) {
      //            if (process.platform === 'win32' && parseFloat(require('os').release(), 10) >= 6.1) {
      //                win.setMaximumSize(screen.availWidth + 15, screen.availHeight + 14);
      //            }
      if (screen.availWidth > 1024) {
        win.maximize();
        isMaxWindow = true;
      }
    } else {
      win.unmaximize();
      isMaxWindow = false;
    }
    return isMaxWindow;
  }

  function Minimize() {
    win.minimize();
  }

  function winClose() {
    win.close();
  }

  function openBrowser(url) {
    if (url) exec('start ' + url);
  }

  if(app_config)
  {
	  //房卡读卡器端口号
	  window.comPort = app_config.ComPort;
	  //摄像机配置
	  //设备IP地址或者域名
	  window.deviceIP = app_config.DHNetSDK.deviceIP;
	  //设备服务端口号
	  window.devicePort = app_config.DHNetSDK.devicePort;
	  //设备登录用户名
	  window.deviceName = app_config.DHNetSDK.deviceName;
	  //设备登录密码
	  window.devicePassword = app_config.DHNetSDK.devicePassword;
	  //身份证识别串口
	  window.iDPort = app_config.IDPort;
  }

  window.async = async; //异步队列
  window.fs = fs;//操作本地文件
  window.path = path; // nodejs获取本地系统文件路径
  window.wrcard = wrcard; // nodejs读写卡模块
  window.termb = termb; // nodejs读取身份证模块
  window.dahua_client = dahua_client; // nodejs大华摄像机模块
  window.openBrowser = openBrowser; // 调用本地浏览器打开网页
}
