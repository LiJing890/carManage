'use strict';

var app = angular.module('roomManageApp');

app.controller('RoomaddBuilding', ['$scope', '$http', 'dialog', '$rootScope', '$sails', function($scope, $http, dialog, $rootScope, $sails) {
    var vm = this;
    $scope.userid = $rootScope.user.id;
    $scope.username = $rootScope.user.username;
    vm.jsondata = {
        bname: "",
        bheight: "",
        bplace: "",
        create_by: $scope.userid,
        create_name: $scope.username,
        bcode: "",
        roomtype: "",
        roomnum: ""
    }
    vm.getHotelRoomtypeList = function() {
        $sails.get("/hroomtype")
            .success(function(data) {
                vm.hotelRoomtypeList = data;
                vm.jsondata.roomtype = vm.hotelRoomtypeList[0].id;
            })
            .error(function(data) {
                alert('error');
            });
        // roomCheckServices.getHotelRoomtypeList().then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelRoomtypeList = response.data.body.data;
        //     vm.jsondata.roomtype=vm.hotelRoomtypeList[0].id;
        //   }
        // });
    };
    //添加楼栋
    vm.addbuilding = function() {
        if ($scope.myForm.$valid) {

            $sails.post("/hbuilding", vm.jsondata)
                .success(function(data) {
                    $scope.closeThisDialog(data);
                })
                .error(function(data) {
                    dialog.notify(data.msg, 'error');
                });
            // $http.post(lpt_host + '/zeus/ws/hotel/hBuilding/save', vm.jsondata)
            // .success(function(data){
            //   // alert("添加成功!");
            //   $scope.closeThisDialog(data);
            // }).error(function(data) {
            //   dialog.notify(data.msg, 'error');
            // });
        }
        $scope.myForm.submitted = true;
    };
    vm.cancel = function() {
        $scope.closeThisDialog(null);
    };
    vm.getHotelRoomtypeList();
}]);
