'use strict';

var app = angular.module('roomManageApp');

app.controller('addLayer', ['$scope', '$http', 'dialog', '$rootScope', '$sails', function($scope, $http, dialog, $rootScope, $sails) {
    var vm = this;
    $scope.userid = $rootScope.user.id;
    $scope.username = $rootScope.user.username;
    vm.jsondata = {
        h_b_id: $scope.b_id,
        floor: "",
        floorcode: "",
        roomcount: "",
        create_by: $scope.userid,
        create_name: $scope.username,
        roomtype: ""
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

    //添加楼层
    vm.addLayer = function() {
        if ($scope.myForm.$valid) {

            $sails.post("/hfloor", vm.jsondata)
                .success(function(data) {
                    $scope.closeThisDialog(data);
                })
                .error(function(data) {
                    dialog.notify(data.msg, 'error');
                });
            // $http.post(lpt_host + '/zeus/ws/hotel/hFloor/save', vm.jsondata)
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
