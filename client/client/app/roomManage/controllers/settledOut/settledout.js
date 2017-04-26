'use strict';

var app = angular.module('roomManageApp');

app.controller('settledoutmain', ['$scope', '$http', 'dialog', '$sails', '$location', function($scope, $http, dialog, $sails, $location) {
    var vm = this;

    vm.queryHotelRoom = {
        h_f_id: "",
        rid: "",
        rstatus: "",
        order: 'roomno',
        sort: 'asc'
    };

    vm.queryHotelRoomType = {
        page: '1',
        rows: '999'
    };

    //房间类型查询
    vm.getHotelRoomtypeList = function() {
        $sails.get("/hroomtype")
            .success(function(data) {
                vm.hotelRoomtypeList = data;
            })
            .error(function(data) {
                alert('error');
            });
        // roomCheckServices.getHotelRoomtypeList(vm.queryHotelRoomType).then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelRoomtypeList = response.data.body.data;
        //   }
        // });
    }

    //楼栋查询
    vm.getHotelBuildList = function() {
        $sails.get("/hbuilding")
            .success(function(data) {
                vm.hotelBuildList = data;
                vm.hotelBuild = data[0];
                vm.getHotelFloorList(vm.hotelBuild.id);
            })
            .error(function(data) {
                dialog.notify(data.msg, 'error');
            });


        // roomCheckServices.getHotelBuildList().then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelBuildList = response.data.body.data;
        //     vm.hotelBuild = response.data.body.data[0];
        //     vm.getHotelFloorList(vm.hotelBuild.id);
        //   }
        // });
    }

    //楼层查询
    vm.getHotelFloorList = function(hotelBuildid) {
        $sails.get("/hfloor?h_b_id=" + hotelBuildid)
            .success(function(data) {
                vm.hotelFloorList = data;
                if (data.length > 0) {
                    vm.hotelFloor = data[0];
                    vm.getHotelRoomList(vm.hotelFloor.id);
                } else {
                    vm.hotelRoomList = [];
                }

            })
            .error(function(data) {
                dialog.notify(data.msg, 'error');
            });
        // roomCheckServices.getHotelFloorList(hotelBuildid).then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelFloorList = response.data.body.data;
        //     vm.hotelFloor = response.data.body.data[0];
        //     vm.getHotelRoomList(vm.hotelFloor.id);
        //   }
        // });
    }

    //房间查询
    vm.getHotelRoomList = function(hotelFloorid) {
        vm.queryHotelRoom.h_f_id = hotelFloorid;
        $sails.get("/hroom?h_f_id=" + hotelFloorid)
            .success(function(data) {
                vm.hotelRoomList = data;

            })
            .error(function(data) {
                dialog.notify(data.msg, 'error');
            });


        // roomCheckServices.getHotelRoomList(vm.queryHotelRoom).then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelRoomList = [];
        //
        //     // var hrl = response.data.body.data;
        //     // var dhrl={};
        //     // var data = [];
        //     // for (var i = hrl.length - 1; i >= 0; i--) {
        //     //     var dhrl=hrl[i];
        //     //     dhrl.issel=false;
        //     //     data.push(dhrl)
        //     // };
        //
        //
        //     vm.hotelRoomList = response.data.body.data;
        //
        //     // var row = 0;
        //     // var count = data.length;
        //     // var group = count / 5;
        //     // for (var i = 0;i< group; i++) {
        //     //   var gp = {
        //     //     item : i,
        //     //     data : []
        //     //   };
        //     //   for (var j = 0; j < 5; j++) {
        //     //     if(data[row] != null){
        //     //       data[row].row = row;
        //     //       gp.data.push(data[row]);
        //     //     }
        //     //     row++;
        //     //   };
        //     //   vm.hotelRoomList.push(gp);
        //     // }
        //   }
        // });
    }

    //房间类型查询
    vm.queryRoomClick = function() {
        vm.getHotelRoomList(vm.hotelFloor.id);
    }

    //查询入住房间详情
    vm.getHotelRoomInfo = function(hotelRoomid) {
        roomCheckServices.getHotelRoomInfo(hotelRoomid).then(function(response) {
            if (response.data.code == "200") {
                vm.hotelRoomInfo = response.data.body.customer;
            }
        });
    }

    //当班收取押金和开房数
    vm.getCustomerInOutNum = function() {
        roomCheckServices.getCustomerInOutNum(user.userid).then(function(response) {
            if (response.data.code == "200") {
                vm.customerInOutNum = response.data.body;
            }
        });
    }

    //当班收取押金和开房数
    vm.getRoomStatic = function() {
        roomCheckServices.getRoomStatic().then(function(response) {
            if (response.data.code == "200") {
                vm.roomStatic = response.data.body;
            }
        });
    }

    //选择楼栋
    vm.activeHotelBuild = function(hotelBuild) {
        vm.hotelBuild = hotelBuild;
        vm.getHotelFloorList(hotelBuild.id);
    }

    //选择楼层
    vm.activeHotelFloor = function(hotelFloor) {
        vm.hotelFloor = hotelFloor;
        vm.getHotelRoomList(hotelFloor.id);
    }

    //选择房间
    vm.activeHotelRoom = function(visble, hotelFloor) {
        if (visble && hotelFloor.rstatus == '2') {
            vm.hotelRoom = hotelFloor;
            vm.getHotelRoomInfo(hotelFloor.id);
        } else {
            vm.hotelRoom = null;
            vm.hotelRoomInfo = null;
        }
    }

    vm.upFloor = function() {
        var upno = 0;
        for (var i = 0; i < vm.hotelFloorList.length; i++) {
            if (vm.hotelFloorList[i].id == vm.hotelFloor.id) {
                if (i > 0) {
                    upno = i - 1;
                } else {
                    upno = vm.hotelFloorList.length - 1;
                }
                break;
            }
        }
        if (upno >= 0) {
            vm.activeHotelFloor(vm.hotelFloorList[upno]);
        }
    }

    vm.downFloor = function() {
        var upno = 0;
        for (var i = 0; i < vm.hotelFloorList.length; i++) {
            if (vm.hotelFloorList[i].id == vm.hotelFloor.id) {
                if (i == (vm.hotelFloorList.length - 1)) {
                    upno = 0;
                } else {
                    upno = i + 1;
                }
                break;
            }
        }
        if (upno >= 0) {
            vm.activeHotelFloor(vm.hotelFloorList[upno]);
        }
    }

    vm.updateStatus = function(data) {
        roomCheckServices.updateStatus(data).then(function(response) {
            if (response.data.code == "200") {
                vm.queryRoomClick();
            } else {
                alert(response.data.msg);
            }
        });
    }

    vm.readCard = function() {
        var data = {
            cardno: "",
            status: "1"
        }
        var wrcard = window.wrcard;
        data.cardno = wrcard.getCardId(window.comPort);
        roomCheckServices.gehCustomerList(data).then(function(response) {
            if (response.data.code == "200") {
                var room = response.data.body.data;
                if (room.length > 0) {
                    room = room[0];
                    room.id = room.h_r_id;
                    vm.clickToSelect(room);
                } else {
                    dialog.notify('该卡尚未入住！', 'error');
                }
            } else {
                alert(response.data.msg);
            }
        });
    }

    vm.clickToSelect = function(room) {
        var evt = window.event || arguments[0];

        if (room.rstatus == "1" && evt.button != 2) {
            $scope.roominfo = room;
            dialog.open({
                template: 'app/roomManage/views/settledOut/checkIn.html',
                className: 'ngdialog-theme-default big-box',
                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                preCloseCallback: function(data) {
                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                    //   return true;
                    // }
                    // return false;
                    if (data != null) {
                        vm.queryRoomClick();
                        // vm.getCustomerInOutNum();
                        // vm.getRoomStatic();
                        dialog.notify('入住成功！', 'success');
                    }
                }
            });
        } else if (room.rstatus == "2" || room.status == "1") {
            $scope.roominfo = room;
            dialog.open({
                template: 'app/roomManage/views/settledOut/checkInOut.html',
                className: 'ngdialog-theme-default custom-box',
                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                preCloseCallback: function(data) {
                    switch (data) {
                        case "1":
                            dialog.open({
                                template: 'app/roomManage/views/settledOut/extend.html',
                                className: 'ngdialog-theme-default big-box',
                                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                                preCloseCallback: function(data) {
                                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                                    //   return true;
                                    // }
                                    // return false;
                                    if (data != null && data.code == "200") {
                                        vm.getCustomerInOutNum();
                                        vm.getRoomStatic();
                                        dialog.notify('续房成功！', 'success');
                                    }
                                }
                            });
                            break;
                        case "2":
                            $scope.roominfo = room;
                            dialog.open({
                                template: 'app/roomManage/views/settledOut/checkOut.html',
                                className: 'ngdialog-theme-default big-box',
                                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                                preCloseCallback: function(data) {
                                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                                    //   return true;
                                    // }
                                    // return false;
                                    if (data != null && data.code == "200") {
                                        vm.getCustomerInOutNum();
                                        vm.getRoomStatic();
                                        vm.queryRoomClick();
                                        dialog.notify('退房成功！', 'success');
                                    }
                                }
                            });
                            break;
                        case "3":
                            dialog.open({
                                template: 'app/roomManage/views/settledOut/fillCard.html',
                                className: 'ngdialog-theme-default big-box',
                                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                                preCloseCallback: function(data) {
                                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                                    //   return true;
                                    // }
                                    // return false;
                                    if (data != null && data.code == "200") {
                                        vm.getCustomerInOutNum();
                                        vm.getRoomStatic();
                                        dialog.notify('补卡成功！', 'success');
                                    }
                                }
                            });
                            break;
                        case "4":
                            dialog.open({
                                template: 'app/roomManage/views/settledOut/changeHouses.html',
                                className: 'ngdialog-theme-default big-box',
                                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                                preCloseCallback: function(data) {
                                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                                    //   return true;
                                    // }
                                    // return false;
                                    if (data != null && data.code == "200") {
                                        vm.getCustomerInOutNum();
                                        vm.getRoomStatic();
                                        vm.queryRoomClick();
                                        dialog.notify('换房成功！', 'success');
                                    }
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
        } else {
            dialog.open({
                template: 'app/roomManage/views/settledOut/checkState.html',
                className: 'ngdialog-theme-default',
                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                preCloseCallback: function(data) {
                    switch (data) {
                        case "3":
                            var data = {
                                roomno: room.roomno,
                                rstatus: "1"
                            }
                            vm.updateStatus(data);
                            break;
                        case "4":
                            var data = {
                                roomno: room.roomno,
                                rstatus: "5"
                            }
                            vm.updateStatus(data);
                            break;
                        default:
                            break;
                    }
                }
            });
        }
    }

    vm.checkWorking = function() {
        settingService.getStatusByUserId(user.userid).then(function(datafr) {
            if (datafr.status == 200 && datafr.data.code == 200) {
                if (datafr.data.body.dutystatus != true) {
                    alert("尚未登记上班，请点击上班后再进行操作!");
                    $location.path("/roomManage/commute");
                    return;
                }
            };
        });
    }

    document.oncontextmenu = function(event) {
        if (document.all)
            window.event.returnValue = false; // for IE
        else
            event.preventDefault();
    }

    // vm.checkWorking();
    vm.getHotelRoomtypeList();
    vm.getHotelBuildList();
    // vm.getCustomerInOutNum();
    // vm.getRoomStatic();
}]);
