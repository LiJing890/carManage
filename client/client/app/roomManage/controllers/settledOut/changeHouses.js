'use strict';

var app=angular.module('roomManageApp');

app.controller('changeHousesCtrl',['$document','$scope','$http','dialog', '$filter','roomCheckServices',function ($document, $scope, $http, dialog, $filter, roomCheckServices) {
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
      if(!vm.makeCard()){
        return;
      }
      vm.jsondata.outime = vm.dateToString(vm.outime);
      vm.jsondata.update_by = user.userid;
      vm.jsondata.update_name = user.realname;
      roomCheckServices.changeroom(vm.jsondata).then(function (response) {
        if(response.data.code == "200"){
          vm.printData();
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
    var rtn = false;
    var wrcard = window.wrcard;
    var carid = wrcard.getCardId(window.comPort);
    if(vm.jsondata.cardno != carid){
      // alert("房卡卡号不一致");
      dialog.notify("房卡卡号不一致！", 'error');
      rtn = false;
    }
    else{
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
        dialog.notify("写卡成功！", 'success');
        vm.audioPlayZK();
        rtn = true;
      } else {
        // alert('写卡失败！');
        dialog.notify("写卡失败！", 'error');
        rtn = false;
      }
    }
    return rtn;
  }

  vm.printData = function(){
      var LODOP=getLodop();
      LODOP.PRINT_INIT("");
      LODOP.SET_PRINT_PAGESIZE(1,2300,940,"");
      LODOP.ADD_PRINT_TEXT(7,403,100,25,"NO:" + vm.jsondata.hycode);
      LODOP.ADD_PRINT_TEXT(35,149,230,30,"雁城物流园旅馆押金收据");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",14);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(71,6,80,25,"开票单位：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(71,279,80,25,"开票时间：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(71,79,180,25,"衡阳雁城物流园");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(71,352,180,25,vm.jsondata.intime);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(99,6,80,25,"姓    名：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(99,79,180,25,vm.jsondata.cusname);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(99,279,80,25,"房    号：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(99,352,180,25,vm.jsondata.roomno);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",12);
      LODOP.SET_PRINT_STYLEA(0,"Bold",1);
      LODOP.ADD_PRINT_TEXT(127,6,80,25,"身份证号：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(127,79,180,25,vm.jsondata.cuscard);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(127,279,80,25,"单    价：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(127,352,210,25,$scope.price + " 元/天(入园停车优惠20元)");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(154,6,80,25,"金    额：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(154,79,180,25,vm.jsondata.deposit + " 元");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(154,279,80,25,"车 牌 号：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(154,352,180,25,vm.jsondata.vehiclenumber);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(182,6,80,25,"收 银 员：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(182,79,180,25,user.username);
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(182,279,80,25,"宾客签名：");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(182,352,180,25,"");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(209,0,580,20,"_________________________________________________________________________________");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.ADD_PRINT_TEXT(230,6,557,95,"备    注：\n1.开房时间在2小时内按半天收费，超过2小时按全天收费。\n2.退房时间为中午12点，超过13点按半价收费，超过16点按全价收费。\n3.请凭此收据于3个月内到雁城物流客房总台结清账务，否则过期作废。\n4.请妥善保管此收据，丢失概不负责。");
      LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
      LODOP.PREVIEW();
      // LODOP.PRINT();
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
