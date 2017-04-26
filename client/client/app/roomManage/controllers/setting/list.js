'use strict';

var app = angular.module('roomManageApp');

app.controller('roomfloorlist', ['$scope', '$http', 'dialog', '$sails', function($scope, $http, dialog, $sails) {
    var vm = this;
    vm.hotelBuild = [];
    vm.hotelFloorList = [];
    vm.hotelRoomList = [];

    vm.start = 0;
    vm.queryHotelRoom = {
        h_f_id: "",
        rid: "",
        order: 'roomno',
        sort: 'asc'
    };
    //楼栋查询
    vm.getHotelBuildList = function() {
        $sails.get("/hbuilding")
            .success(function(data) {
                vm.hotelBuildList = data;
                if (vm.hotelBuild.length <= 0) {
                    vm.hotelBuild = data[0];
                }
                vm.getHotelFloorList(vm.hotelBuild.id);
                vm.activeHotelBuild(vm.hotelBuild);
            })
            .error(function(data) {
                dialog.notify(data.msg, 'error');
            });
        // roomCheckServices.getHotelBuildList().then(function (response) {
        // 	if(response.data.code == "200"){
        // 		vm.hotelBuildList = response.data.body.data;
        //     if(vm.hotelBuild.length <= 0){
        // 		  vm.hotelBuild = response.data.body.data[0];
        //     }
        // 		// vm.getHotelFloorList(vm.hotelBuild.id);
        //     vm.activeHotelBuild(vm.hotelBuild);
        // 	}
        // });
    };

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
        // 	if(response.data.code == "200"){
        // 		vm.hotelFloorList = response.data.body.data;
        // 		vm.hotelFloor = response.data.body.data[0];
        // 		vm.getHotelRoomList(vm.hotelFloor.id);
        // 	}
        // });
    };
    //房间查询
    vm.getHotelRoomList = function(hotelFloorid) {
        $sails.get("/hroom?h_f_id=" + hotelFloorid)
            .success(function(data) {
                vm.hotelRoomList = data;

            })
            .error(function(data) {
                dialog.notify(data.msg, 'error');
            });
        // vm.queryHotelRoom.h_f_id = hotelFloorid;
        // roomCheckServices.getHotelRoomList(vm.queryHotelRoom).then(function (response) {
        //   if(response.data.code == "200"){
        //     // vm.hotelRoomList = [];
        // 		//
        //     // var data = response.data.body.data;
        // 		//
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
        // 		// 取消分组
        // 		vm.hotelRoomList = response.data.body.data;
        //   }
        // })
    }

    //当班收取押金和开房数
    vm.getCustomerInOutNum = function() {
        roomCheckServices.getCustomerInOutNum().then(function(response) {
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
    };
    //选择楼层
    vm.activeHotelFloor = function(hotelFloor) {
        vm.hotelFloor = hotelFloor;
        vm.getHotelRoomList(hotelFloor.id);
    };

    //选择房间
    // vm.activeHotelRoom = function(visble,hotelFloor){
    //   if(visble && hotelFloor.rstatus == '2'){
    //     vm.hotelRoom = hotelFloor;
    //     vm.getHotelRoomInfo(hotelFloor.id);
    //   }
    //   else{
    //     vm.hotelRoom = null;
    //     vm.hotelRoomInfo = null;
    //   }
    // };

    //删除房间
    vm.clickToDeleteRoom = function(room) {
        dialog.confirmDialog('确认是否要删除房间[' + room.roomno + ']?').then(function(data) {
            if (data) {
                $sails.delete("/hroom/" + room.id)
                    .success(function(data) {
                        vm.getHotelRoomList(vm.hotelFloor.id);
                        dialog.notify('删除成功！', 'success');
                    })
                    .error(function(data) {
                        dialog.notify(data.msg, 'error');
                    });
                // $http.delete(lpt_host + '/zeus/ws/hotel/hRoom/delete/' + room.id)
                // .success(function(data){
                //   if(data != null && data.code=="200"){
                //     vm.getHotelRoomList(vm.hotelFloor.id);
                //     dialog.notify('删除成功！', 'success');
                //   }
                // });
            }
        });
    }
    vm.clickToDeleteBuilding = function(building) {
        dialog.confirmDialog('确认是否要删除[' + building.bname + ']?').then(function(data) {
            if (data) {
                $sails.delete("/hbuilding/" + building.id)
                    .success(function(data) {
                        vm.hotelBuild = [];
                        vm.getHotelBuildList();
                        dialog.notify('删除成功！', 'success');
                    })
                    .error(function(data) {
                        dialog.notify(data.msg, 'error');
                    });

                // $http.delete(lpt_host + '/zeus/ws/hotel/hBuilding/delete/' + building.id)
                // .success(function(data){
                //   vm.hotelBuild = [];
                //   vm.getHotelBuildList();
                //   dialog.notify('删除成功！', 'success');
                // });
            }
        });
    };
    //上一层
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
    };
    //下一层
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
    };
    //添加楼栋
    vm.clickToAddBuilding = function() {
        dialog.open({
            template: 'app/roomManage/views/setting/addBuilding.html',
            scope: $scope, //将scope传给test.html,以便显示地址详细信息
            preCloseCallback: function(data) {
                // if(confirm('Are you sure you want to close without saving your changes?')) {
                //   return true;
                // }
                // return false;
                if (data != null) {
                    vm.hotelBuild = data;
                    vm.getHotelBuildList();
                }
            }
        });
    };
    //添加楼层
    vm.clickToAddFloor = function(b_id) {
        $scope.b_id = b_id;
        dialog.open({
            template: 'app/roomManage/views/setting/addLayer.html',
            scope: $scope, //将scope传给test.html,以便显示地址详细信息
            preCloseCallback: function(data) {
                // if(confirm('Are you sure you want to close without saving your changes?')) {
                //   return true;
                // }
                // return false;
                if (data != null) {
                    vm.getHotelBuildList();
                }
            }
        });
    };
    //添加房间
    vm.clickToAddRoom = function(f_id) {
        $scope.f_id = f_id;
        dialog.open({
            template: 'app/roomManage/views/setting/addRoom.html',
            scope: $scope, //将scope传给test.html,以便显示地址详细信息
            preCloseCallback: function(data) {
                // if(confirm('Are you sure you want to close without saving your changes?')) {
                //   return true;
                // }
                // return false;
                if (data != null) {
                    vm.getHotelBuildList();
                }
            }
        });
    };
    //鼠标滑动事件
    vm.Isactive = function(visble, hotelFloor) {
        if (visble && hotelFloor.rstatus != '2') {
            vm.hotelRoom = hotelFloor;
        } else {
            vm.hotelRoom = null;
            vm.hotelRoomInfo = null;
        }
    };
    //鼠标单击事件
    vm.ClickSelect = function(hFl, tthis) {
        var evt = window.event || arguments[0];
        if (evt.shiftKey) {
            var si = vm.start == null ? 0 : vm.start.$index;
            var ti = tthis.$index;

            for (var i = 0; i < vm.hotelRoomList.length; i++) {
                //分组循环
                // for(var j = 0;j < vm.hotelRoomList[i].data.length; j++){
                if (i >= Math.min(si, ti) && i <= Math.max(si, ti) && vm.hotelRoomList[i].rstatus != '2') {
                    vm.hotelRoomList[i].issel = true;
                } else {
                    vm.hotelRoomList[i].issel = false;
                }
                // }
            }
            return;
        }
        if (evt.ctrlKey) {
            var ki = vm.start == null ? 0 : vm.start;
            if (hFl.rstatus != '2' && !hFl.issel) {
                hFl.issel = true;
            } else {
                hFl.issel = false;
            }
            return;
        };
        angular.forEach(vm.hotelRoomList, function(item) {
            angular.forEach(item.data, function(data) {
                if (data != hFl) {
                    data.issel = false;
                };
            })
        })
        vm.start = hFl.row;
        if (hFl.rstatus != '2') {
            hFl.issel = true;
        } else {
            hFl.issel = false;
        }
        // ----------------------
        //         var e = window.event||arguments[0];
        //                 if (e.shiftKey) {
        //                     var si = $(start).index(), ti = $(tthis).index();
        //                     var sel = $("p").slice(Math.min(si, ti), Math.max(si, ti) + 1);
        //                     sel.attr("sel", "sel");
        //                     $("p").not(sel).removeAttr("sel");
        //                     return;
        //                 }
        //                 start = tthis;
        //                 if ($(tthis).attr("sel") == "sel") {
        //                     $(tthis).removeAttr("sel");
        //                 } else {
        //                     $(tthis).attr("sel", "sel");
        //                 }


        // ---------------
    };
    vm.BatchDel = function() {
        var delItem = [];
        angular.forEach(vm.hotelRoomList, function(data) {
            if (data.issel == true) {
                delItem.push(data);
            }
        })

        if (delItem.length > 0) {
            dialog.confirmDialog('确认是否要删除这些房间?').then(function(data) {
                if (data) {
                    var delbatch = false;
                    for (var i = 0; i < delItem.length; i++) {
                        $sails.delete("/hroom/" + delItem[i].id)
                            .success(function(data) {
                                delbatch = true;
                                vm.getHotelRoomList(vm.hotelFloor.id);
                            })
                            .error(function(data) {
                                dialog.notify(data.msg, 'error');
                            });
                        //
                        // $http.delete(lpt_host + '/zeus/ws/hotel/hRoom/delete/' + delItem[i].id)
                        //   .success(function(data){
                        //     if(data != null && data.code=="200"){
                        //       delbatch = true;
                        //       // dialog.notify('删除成功！', 'success');
                        //       vm.getHotelRoomList(vm.hotelFloor.id);
                        //     }
                        //   });
                    }
                    dialog.notify('房间删除成功！', 'success');
                }
            });
        } else {
            dialog.notify("请选择需要删除的房间！", 'error');
        }
    };
    //删除楼层
    vm.Delfloor = function(floor) {
        dialog.confirmDialog('确认是否要删除楼层[' + floor.floor + ']?').then(function(data) {
            if (data) {
                $sails.delete("/hfloor/" + floor.id)
                    .success(function(data) {
                        vm.getHotelBuildList();
                        dialog.notify('楼层删除成功！', 'success');
                    })
                    .error(function(data) {
                        dialog.notify(data.msg, 'error');
                    });
                // $http.delete(lpt_host + '/zeus/ws/hotel/hFloor/delete/' + floor.id)
                // .success(function(data){
                //   if(data != null && data.code=="200"){
                //     vm.getHotelBuildList();
                //     dialog.notify('楼层删除成功！', 'success');
                //   }else{
                //      dialog.notify(data.msg, 'error');
                //   }
                // });
            }
        });
    };
    //编辑房间
    vm.clickToEditRoom = function(hr) {
        if (hr.rstatus == 2) {
            dialog.notify(hr.roomno + "房间使用中不能编辑！", 'error');
        } else {
            $scope.hr = hr;
            dialog.open({
                template: 'app/roomManage/views/setting/editRoom.html',
                scope: $scope, //将scope传给test.html,以便显示地址详细信息
                preCloseCallback: function(data) {
                    // if(confirm('Are you sure you want to close without saving your changes?')) {
                    //   return true;
                    // }
                    // return false;
                    if (data != null && data.code == "200") {
                        vm.getHotelBuildList();
                    }
                    $scope.hr = null;
                }
            });
        }
    };
    // vm.getHotelRoomtypeList();
    vm.getHotelBuildList();
    // vm.getCustomerInOutNum();
    // vm.getRoomStatic();
}]);
