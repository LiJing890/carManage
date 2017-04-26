'use strict';

var kapp=angular.module('roomManageApp');

kapp.controller('checkState',['$scope','$http','ngDialog','roomCheckServices',function ($scope, $http, ngDialog, roomCheckServices) {
  var vm = this;

  //新增OR修改
  vm.cheangeView = function(state){
    $scope.closeThisDialog(state);
  }

}]);