'use strict';

var app = angular.module('roomManageApp');

app.controller('addRoom', ['$scope', '$http', 'dialog', '$rootScope', '$sails', function($scope, $http, dialog, $rootScope, $sails) {
    var vm = this;
    $scope.userid = $rootScope.user.id;
    $scope.username = $rootScope.user.username;
    // vm.jsondata={h_f_id:$scope.f_id,rid:"",rtname:"",create_by:$scope.userid,create_name:$scope.username,roomno:""};
    vm.queryHotelRoom = {
        rtname: "",
        rid: ""
    };

    vm.jsondata = {
        h_f_id: $scope.f_id,
        rid: "",
        rtname: "",
        create_by: $scope.userid,
        create_name: $scope.username,
        roomno: "",
        rstatus: 1
    };
    //房间类型查询
    vm.getHotelRoomtypeList = function() {

        $sails.get("/hroomtype")
            .success(function(data) {
                vm.hotelRoomtypeList = data;
                vm.queryHotelRoom.rid = vm.hotelRoomtypeList[0].id;
            })
            .error(function(data) {
                alert('error');
            });
        // roomCheckServices.getHotelRoomtypeList().then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelRoomtypeList = response.data.body.data;
        //     vm.queryHotelRoom.rid=vm.hotelRoomtypeList[0].id;
        //   }
        // });
    };
    // vm.editgetroom=function(){
    // 	if ($scope.hr!=null) {
    // 		vm.queryHotelRoom.rid=hr.rid;
    // 		vm.jsondata.roomno=hr.roomno;
    // 	};
    // }
    //添加房间
    vm.addRoom = function() {
        if ($scope.myForm.$valid) {
            vm.jsondata.rid = vm.queryHotelRoom.rid;
            $sails.post("/hroom", vm.jsondata)
                .success(function(data) {
                    $scope.closeThisDialog(data);
                })
                .error(function(data) {
                    dialog.notify(data.msg, 'error');
                });
        }
        $scope.myForm.submitted = true;
    };
    vm.cancel = function() {
        $scope.closeThisDialog(null);
    };
    vm.getHotelRoomtypeList();
    // vm.editgetroom();
}]);
