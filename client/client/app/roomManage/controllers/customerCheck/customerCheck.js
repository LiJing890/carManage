'use strict';

var app=angular.module('roomManageApp');

app.controller('hotelCustomer',['$scope','$http','ngDialog',function ($scope, $http, ngDialog) {
  var vm = this;

  // 配置分页基本参数
  $scope.paginationConf = {
    currentPage: 1,
    itemsPerPage: 10,
    //以下实际应用中可注释
    totalItems:0
  };

  vm.hotelCustomerlist = [];

  vm.querydata = {
    page: 1,
    rows: 10,
    order:"intime"
  };

  vm.getHotelCustomer = function(){
    if($scope.paginationConf.currentPage > 0){
      vm.querydata.page= $scope.paginationConf.currentPage;
      vm.querydata.rows= $scope.paginationConf.itemsPerPage;
      vm.querydata.entrytimestart = vm.dateToString(vm.SDate);
      if(vm.querydata.entrytimestart.length > 0){
        vm.querydata.entrytimestart = vm.querydata.entrytimestart + " 00:00:00";
      }
      vm.querydata.outtimeend = vm.dateToString(vm.EDate);
      if(vm.querydata.outtimeend.length > 0){
        vm.querydata.outtimeend = vm.querydata.outtimeend + " 23:59:59"
      }
      $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getlist',{ params: vm.querydata}).success(function(data) {
        if(data.code="200")
        {
          vm.hotelCustomerlist = data.body.data;
          // 变更分页的总数
          $scope.paginationConf.totalItems = data.body.totalRecords;
          // // 变更产品条目
          // $scope.products = data.items;
        }
      });
    }
  }

  vm.querylist = function(){
    $scope.paginationConf.currentPage = 1;
    vm.getHotelCustomer();
  }

  vm.getSex = function(sex){
    if(sex == "1"){
      return "男";
    }
    else{
      return "女";
    }
  }

  vm.totalDateTime = function(startDate,endDate){
    var dtStart = new Date(startDate);
    var dtend = new Date(endDate);
    var date3=dtend.getTime()-dtStart.getTime();  //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
    //计算出小时数
    var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    var rtn = "";
    if(days>0){
      rtn += days + "天 ";
    }
    if(hours>0){
      rtn += hours + "小时 ";
    }
    if(minutes>0){
      rtn += minutes + "分钟 ";
    }
    if(seconds>0){
      rtn += seconds + "秒 ";
    }
    return rtn;
  }

  vm.dateToString = function(datetime) {
    if (datetime != null) {
      var now = new Date(datetime);
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日
      var clock = year + "-";
      if (month < 10)
        clock += "0";
      clock += month + "-";
      if (day < 10)
        clock += "0";
      clock += day;
      return (clock);
    } else {
      return "";
    }
  }

  vm.ResetQuery = function(){
    vm.SDate = null;
    vm.EDate = null;
    vm.querydata.entrytimestart = "";
    vm.querydata.outtimeend = "";
    vm.querydata.roomno = "";
    vm.querydata.cusname = "";
    vm.querydata.cuscard = "";
    vm.querydata.tel = "";
    $scope.paginationConf.currentPage = 1;
    vm.getHotelCustomer();
  }

  //初始化查询
  // vm.getfeescalelist();
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  $scope.$watch('paginationConf.currentPage', vm.getHotelCustomer);
}]);
