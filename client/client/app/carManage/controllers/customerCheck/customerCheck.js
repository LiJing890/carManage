'use strict';

var app = angular.module('carManageApp');

app.controller('carCustomer', ['$scope', '$http', 'dialog', '$sails', function ($scope, $http, dialog, $sails) {
  // 配置分页基本参数
  $scope.paginationConf = {
    currentPage: 1,
    itemsPerPage: 10,
    //以下实际应用中可注释
    totalItems: 0
  };

  // $scope.carCustomerList = [];

  $scope.querydata = {
    page: 1,
    rows: 10,
    order: "intime"
  };




  $scope.getCarCustomer = function () {
      $sails.get("/c_custom")
        .success(function (data) {
          if (data) {
            $scope.carCustomerList = data;
          }
        })
        .error(function (data) {
          dialog.notify(data.msg, 'error');
        });

    
  }

  $scope.querylist = function () {
    $scope.paginationConf.currentPage = 1;
    $scope.getCarCustomer();
  }

  $scope.getSex = function (sex) {
    if (sex == "1") {
      return "男";
    } else {
      return "女";
    }
  }

  $scope.getCarCustomer();

 

  //初始化查询
  // vm.getfeescalelist();
  // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
  // $scope.$watch('paginationConf.currentPage', $scope.getCarCustomer);
}]);