'use strict';

var app=angular.module('roomManageApp');

app.controller('fillCardCtrl',['$document','$scope','$http','dialog', '$filter','roomCheckServices',function ($document, $scope, $http, dialog, $filter, roomCheckServices) {
  var vm = this;

  vm.jsondata = {
    h_r_id:"",        //房间号id
    cusname:"",       //客户姓名
    cussex:"1",        //客户性别（1男2女）
    cuscard:"",       //客户身份证
    tel:"",           //客户电话
    birthplace:"",    //客户籍贯
    cardno:"",        //卡号
    intime:"",        //入住时间
    outime:"",        //预计离房时间
    costtype:"1",      //消费方式
    priceday:"80",      //单价-天
    pricehour:"10",     //单价-小时
    roomno:"",        //房间号
    rtname:"",        //房间类型
    vehiclenumber:"", //车辆牌照
    deposit:"",       //押金
    cname1:"",        //同行人1姓名
    csex1:"",         //同行人1性别
    ccard1:"",        //同行人2身份证号
    cname2:"",        //同行人1姓名
    csex2:"",         //同行人1性别
    ccard2:"",        //同行人2身份证号
    create_by:"",     //创建人
    create_name:""    //创建人名称
  };

  vm.queryHotelRoomType = {
    page:'1',
    rows:'999',
    id:""
  };

  // //房间类型查询
  // vm.getHotelRoomtypeList = function(){
  //   roomCheckServices.getHotelRoomtypeList(vm.queryHotelRoomType).then(function (response) {
  //     if(response.data.code == "200"){
  //       vm.hotelRoomtype = response.data.body.data[0];
  //       vm.jsondata.priceday = vm.hotelRoomtype.rtdprice;
  //       vm.jsondata.pricehour = vm.hotelRoomtype.rthprice;
  //       //默认设置
  //       $scope.price = vm.jsondata.priceday;
  //     }
  //   });
  // }


  vm.costtypeChange = function(){
    if(vm.jsondata.costtype == "1"){
      $scope.price = vm.jsondata.priceday;
    }
    else{
      $scope.price = vm.jsondata.pricehour;
    }
  }

  //获取押金流水号
  vm.getMaxSerialNumber = function(){
    roomCheckServices.getMaxSerialNumber().then(function (response) {
      if(response.data.code == "200"){
        vm.jsondata.hycode = response.data.body;
      }
    });
  }

    //客房初始化信息
  vm.getHotelRoomInfo = function(roomid){
    roomCheckServices.getHotelRoomInfo(roomid).then(function (response) {
      if(response.data.code == "200"){
        vm.getMaxSerialNumber();
        vm.jsondata = response.data.body.customer;
        vm.outime = vm.jsondata.outime;
        if(vm.jsondata.costtype == "1"){
          $scope.price = vm.jsondata.priceday;
        }
        else{
          $scope.price = vm.jsondata.pricehour;
        }
        $scope.yjdeposits = vm.jsondata.deposit;
      }
    });
  }

  //新增OR修改
  vm.save = function(){
    if($scope.myForm.$valid){
      vm.jsondata.outime = vm.dateToString(vm.outime);
      vm.jsondata.update_by = user.userid;
      vm.jsondata.update_name = user.realname;
      roomCheckServices.renewRoomCard(vm.jsondata).then(function (response) {
        if(response.data.code == "200"){
          $scope.closeThisDialog(response.data);
        }
        else{
          dialog.notify(response.data.msg, 'error');
          $scope.closeThisDialog(null);
        }
      });
    }
    $scope.myForm.submitted = true;
  }

  vm.cancel = function(){
    $scope.closeThisDialog(null);
  }

  vm.depositChange = function(){
    if(!isNaN($scope.xfdeposits)){
      vm.jsondata.deposit = parseFloat($scope.yjdeposits) + parseFloat($scope.xfdeposits);
    }
  }

  vm.makeCard = function(){
    var wrcard = window.wrcard;
    var carid = wrcard.getCardId(window.comPort);
    vm.jsondata.cardno = carid;
    var card = {
      nRoom: vm.jsondata.roomno.substring(1),
      // Wstartdate: $filter('formatDate')(vm.jsondata.intime, 'YYYYMMDDHHmm'),
      Wstartdate:'000000000000',      
      Wenddate: $filter('formatDate')(vm.outime, 'YYYYMMDDHHmm'),
      Vioce: '1',
      Obt: '0',
      Op: "8888",
      nCode: '1',
      jLift: '0'
    };
    var result = wrcard.w_Card(card.nRoom, card.Wstartdate, card.Wenddate, card.Vioce, card.Obt, card.Op, card.nCode, card.jLift);
    if (result == 1) {
      // alert('写卡成功！');
      // dialog.notify("写卡成功！", 'success');
      vm.save();
      vm.audioPlayZK();
    } else {
      // alert('写卡失败！');
      dialog.notify("写卡失败！", 'error');
    }
  }

  vm.dateToString = function(datetime){
    if(datetime!=null){
      var now = new Date(datetime);
      var year = now.getFullYear();       //年
      var month = now.getMonth() + 1;     //月
      var day = now.getDate();            //日
      var hh = now.getHours();            //时
      var mm = now.getMinutes();          //分
      var ss = now.getSeconds();          //秒
      var clock = year + "-";
      if(month < 10) clock += "0";
      clock += month + "-";
      if(day < 10) clock += "0";
      clock += day + " ";
      if(hh < 10) clock += "0";
      clock += hh + ":";
      if (mm < 10) clock += '0';
      clock += mm + ":";
      if (ss < 10) clock += '0';
      clock += ss;
      return(clock);
    }
    else{
      return "";
    }
  }

  vm.audioPlayZK = function(){
    var audioZK = $document.find('#audioZK')[0];
    audioZK.play();
  }

  vm.queryHotelRoomType.id = $scope.roominfo.rid;
  vm.getHotelRoomInfo($scope.roominfo.id);

}]);
