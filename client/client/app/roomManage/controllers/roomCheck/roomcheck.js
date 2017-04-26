'use strict';

var kapp=angular.module('roomManageApp');

kapp.controller('roomchecklist',['$scope','$http','ngDialog','roomCheckServices',function ($scope, $http, ngDialog, roomCheckServices) {
  var vm = this;

  vm.roomVisble = false;

  vm.queryHotelRoom = {
    page:'1',
    rows:'999',
    h_f_id:"",
    rid:"",
    rstatus:"",
    order:'roomno',
    sort:'asc'
  };

  //房间类型查询
  vm.getHotelRoomtypeList = function(){
    roomCheckServices.getHotelRoomtypeList().then(function (response) {
      if(response.data.code == "200"){
        vm.hotelRoomtypeList = response.data.body.data;
      }
    });
  }

  //房间类型查询
  vm.queryRoomClick = function(){
    vm.getHotelRoomList(vm.hotelFloor.id);
  }

  //楼栋查询
  vm.getHotelBuildList = function(){
    roomCheckServices.getHotelBuildList().then(function (response) {
      if(response.data.code == "200"){
        vm.hotelBuildList = response.data.body.data;
        vm.hotelBuild = response.data.body.data[0];
        vm.getHotelFloorList(vm.hotelBuild.id);
      }
    });
  }

  //楼层查询
  vm.getHotelFloorList = function(hotelBuildid){
    roomCheckServices.getHotelFloorList(hotelBuildid).then(function (response) {
      if(response.data.code == "200"){
        vm.hotelFloorList = response.data.body.data;
        vm.hotelFloor = response.data.body.data[0];
        vm.getHotelRoomList(vm.hotelFloor.id);
      }
    });
  }

  //房间查询
  vm.getHotelRoomList = function(hotelFloorid){
    vm.queryHotelRoom.h_f_id = hotelFloorid;
    roomCheckServices.getlistWithCustomer(vm.queryHotelRoom).then(function (response) {
      if(response.data.code == "200"){
        vm.hotelRoomList = [];

        // var hrl = response.data.body.data;
        // var dhrl={};
        // var data = [];
        // for (var i = hrl.length - 1; i >= 0; i--) {
        //     var dhrl=hrl[i];
        //     dhrl.issel=false;
        //     data.push(dhrl)
        // };


        var data = response.data.body.data;

        var row = 0;
        var count = data.length;
        var group = count / 5;
        for (var i = 0;i< group; i++) {
          var gp = {
            item : i,
            data : []
          };
          for (var j = 0; j < 5; j++) {
            if(data[row] != null){
              data[row].row = row;
              gp.data.push(data[row]);
            }
            row++;
          };
          vm.hotelRoomList.push(gp);
        };
      }
    });
  }

  //当班收取押金和开房数
  vm.getCustomerInOutNum = function(){
    roomCheckServices.getCustomerInOutNum().then(function (response) {
      if(response.data.code == "200"){
        vm.customerInOutNum = response.data.body;
      }
    });
  }

  //当班收取押金和开房数
  vm.getRoomStatic = function(){
    roomCheckServices.getRoomStatic().then(function (response) {
      if(response.data.code == "200"){
        vm.roomStatic = response.data.body;
      }
    });
  }

  //选择楼栋
  vm.activeHotelBuild = function(hotelBuild){
    vm.hotelBuild = hotelBuild;
    vm.getHotelFloorList(hotelBuild.id);
  }

  //选择楼层
  vm.activeHotelFloor = function(hotelFloor){
    vm.hotelFloor = hotelFloor;
    vm.getHotelRoomList(hotelFloor.id);
  }

    //选择房间
  vm.activeHotelRoom = function(visble,hotelFloor){
    if(visble && hotelFloor.rstatus == '2'){
      vm.hotelRoom = hotelFloor;
    }
    else{
      vm.hotelRoom = null;
      vm.hotelRoomInfo = null;
    }
  }

  vm.upFloor = function(){
    var upno = 0;
    for(var i=0; i < vm.hotelFloorList.length; i++){ 
      if(vm.hotelFloorList[i].id == vm.hotelFloor.id) {
        if(i>0){
          upno = i - 1;
        }
        else{
          upno = vm.hotelFloorList.length - 1;
        }
        break;
      }
    }
    if(upno >= 0){
      vm.activeHotelFloor(vm.hotelFloorList[upno]);
    }
  }

  vm.downFloor = function(){
    var upno = 0;
    for(var i=0; i < vm.hotelFloorList.length; i++){ 
      if(vm.hotelFloorList[i].id == vm.hotelFloor.id) {
        if(i == (vm.hotelFloorList.length -1)){
          upno = 0;
        }
        else{
          upno = i + 1;
        }
        break;
      }
    }
    if(upno >= 0){
      vm.activeHotelFloor(vm.hotelFloorList[upno]);
    }
  }

  vm.getHotelRoomtypeList();
  vm.getHotelBuildList();
  vm.getCustomerInOutNum();
  vm.getRoomStatic();
}]);