'use strict';

var rcconfigController = angular.module('roomManageApp');
rcconfigController.controller('roomModelctrl', ['$scope', '$filter', 'settingService', 'dialog', '$sails', function($scope, $filter, settingService, dialog, $sails) {
    $scope.roomconfig = [];
    $scope.roomconfigj = [];
    $scope.jsondata = {
        rtname: '',
        rtcode: '',
        rtdprice: '',
        rthprice: ''
    };
    $scope.$watch('roomconfigj', function(nv, ov) {
        if (nv == ov) {
            return;
        };
        $scope.choseArr = "";
        $scope.choseArrid = "";
        $scope.choseArrsum = "";
        angular.forEach(
            $filter('filter')(nv, {
                ischecked: true
            }),
            function(v) {
                // $scope.choseArr= $scope.choseArr+","+v.rcname;
                // $scope.choseArrid=$scope.choseArrid+","+v.id;
                // if ($scope.choseArr!="") {
                // }else{
                // }
                if ($scope.choseArrid != "") {
                    $scope.choseArrid = $scope.choseArrid + "," + v.id;
                    $scope.choseArr = $scope.choseArr + "," + v.rcname;
                    $scope.choseArrsum = $scope.choseArrsum + "," + v.rtconfignum;
                } else {
                    $scope.choseArrid = $scope.choseArrid + v.id;
                    $scope.choseArr = $scope.choseArr + v.rcname;
                    $scope.choseArrsum = $scope.choseArrsum + v.rtconfignum;
                };
            });
    }, true);
    $scope.$watch('roomconfig', function(nv1, ov1) {
        if (nv1 == ov1) {
            return;
        };
        $scope.chosestr = "";
        $scope.chosestrid = "";
        $scope.chosestrsum = "";
        angular.forEach(
            $filter('filter')(nv1, {
                ischecked: true
            }),
            function(v1) {
                // if ($scope.chosestr!="") {
                // 	$scope.chosestr= $scope.chosestr+","+v1.rcname;
                // }else{
                // 	$scope.chosestr= $scope.chosestr+v1.rcname;
                // }
                if ($scope.chosestrid != "") {
                    $scope.chosestrid = $scope.chosestrid + "," + v1.id;
                    $scope.chosestrsum = $scope.chosestrsum + "," + v1.rtconfignum;
                    $scope.chosestr = $scope.chosestr + "," + v1.rcname;
                } else {
                    $scope.chosestrid = $scope.chosestrid + v1.id;
                    $scope.chosestrsum = $scope.chosestrsum + v1.rtconfignum;
                    $scope.chosestr = $scope.chosestr + v1.rcname;
                };
            });
    }, true);
    $scope.getroomconfigs = function() {


        $sails.get("/hroomconfig?rctype=1")
            .success(function(data) {
                var list = [];
                for (var i = data.length - 1; i >= 0; i--) {
                    list = data[i];
                    list.rcsum = 0;
                    list.ischecked = false;
                    list.rtconfignum = "";
                    $scope.roomconfigj.push(list);
                };

                $sails.get("/hroomconfig?rctype=0")
                    .success(function(data) {
                        var list = [];
                        for (var i = data.length - 1; i >= 0; i--) {
                            list = data[i];
                            list.rcsum = 0;
                            list.ischecked = false;
                            list.rtconfignum = "";
                            $scope.roomconfig.push(list);
                        };
                        if ($scope.updateId != "") {

                            $sails.get("/hroomtype/" + $scope.updateId)
                                .success(function(data) {
                                    if (data) {
                                        $scope.jsondata = data;
                                        if ($scope.jsondata.rtconfigids == null) {
                                            return;
                                        };
                                        var rcs = $scope.jsondata.rtconfigids.split(',');
                                        var rcsums = $scope.jsondata.rtconfignum.split(',');
                                        for (var i = rcs.length - 1; i >= 0; i--) {
                                            for (var j = $scope.roomconfigj.length - 1; j >= 0; j--) {
                                                if (rcs[i] == $scope.roomconfigj[j].id) {
                                                    $scope.roomconfigj[j].ischecked = true;
                                                    $scope.roomconfigj[j].rtconfignum = rcsums[i];
                                                }
                                            };
                                            for (var k = $scope.roomconfig.length - 1; k >= 0; k--) {
                                                if (rcs[i] == $scope.roomconfig[k].id) {
                                                    $scope.roomconfig[k].ischecked = true;
                                                    $scope.roomconfig[k].rtconfignum = rcsums[i];
                                                }
                                            };
                                        };
                                    }
                                })
                                .error(function(data) {
                                    dialog.notify(data.msg, 'error');
                                });
                            // settingService.getRoomModelById($scope.updateId).then(function(datamodel){
                            // 	if (datamodel.data.code==200) {
                            // 		$scope.jsondata.rtname=datamodel.data.body.rtname;
                            // 		$scope.jsondata.rtcode=datamodel.data.body.rtcode;
                            // 		$scope.jsondata.rtdprice=datamodel.data.body.rtdprice;
                            // 		$scope.jsondata.rthprice=datamodel.data.body.rthprice;
                            // 		if (datamodel.data.body.rtconfigids==null) {
                            // 			return;
                            // 		};
                            // 		var rcs = datamodel.data.body.rtconfigids.split(',');
                            // 		var rcsums = datamodel.data.body.rtconfignum.split(',');
                            // 		for (var i = rcs.length - 1; i >= 0; i--) {
                            // 			for (var j = $scope.roomconfigj.length - 1; j >= 0; j--) {
                            // 				if(rcs[i] ==$scope.roomconfigj[j].id){
                            // 					$scope.roomconfigj[j].ischecked= true;
                            // 					$scope.roomconfigj[j].rtconfignum=rcsums[i];
                            // 				}
                            // 			};
                            // 			for (var k = $scope.roomconfig.length - 1; k >= 0; k--) {
                            // 				if(rcs[i] ==$scope.roomconfig[k].id){
                            // 					$scope.roomconfig[k].ischecked= true;
                            // 					$scope.roomconfig[k].rtconfignum=rcsums[i];
                            // 				}
                            // 			};
                            // 		};
                            //
                            // 	}else{
                            // 		$scope.jsondata=null;
                            // 	};
                            // });
                        } else {
                            $scope.jsondata = {
                                rtname: '',
                                rtcode: '',
                                rtdprice: '',
                                rthprice: ''
                            };
                        };
                    })
                    .error(function(data) {
                        alert('error');
                    });

            })
            .error(function(data) {
                alert('error');
            });


        // 		settingService.getRcList({"rows":"999","pages":"1","rctype":"2"}).then(function(data){
        // 			if (data.data.code==200) {
        //
        //
        // 				settingService.getRcList({"rows":"999","pages":"1","rctype":"1"}).then(function(data){
        // 					if (data.data.code==200) {
        // 						var listx=[];
        // 						for (var i = data.data.body.data.length - 1; i >= 0; i--) {
        // 							listx=data.data.body.data[i];
        // 							listx.rcsum=0;
        // 							listx.ischecked=false;
        // 							listx.rtconfignum="";
        // 							$scope.roomconfig.push(listx);
        // 						};
        //
        // 						if ($scope.updateId!="") {
        // 							settingService.getRoomModelById($scope.updateId).then(function(datamodel){
        // 								if (datamodel.data.code==200) {
        // 									$scope.jsondata.rtname=datamodel.data.body.rtname;
        // 									$scope.jsondata.rtcode=datamodel.data.body.rtcode;
        // 									$scope.jsondata.rtdprice=datamodel.data.body.rtdprice;
        // 									$scope.jsondata.rthprice=datamodel.data.body.rthprice;
        // 									if (datamodel.data.body.rtconfigids==null) {
        // 										return;
        // 									};
        // 									var rcs = datamodel.data.body.rtconfigids.split(',');
        // 									var rcsums = datamodel.data.body.rtconfignum.split(',');
        // 									for (var i = rcs.length - 1; i >= 0; i--) {
        // 										for (var j = $scope.roomconfigj.length - 1; j >= 0; j--) {
        // 											if(rcs[i] ==$scope.roomconfigj[j].id){
        // 												$scope.roomconfigj[j].ischecked= true;
        // 												$scope.roomconfigj[j].rtconfignum=rcsums[i];
        // 											}
        // 										};
        // 										for (var k = $scope.roomconfig.length - 1; k >= 0; k--) {
        // 											if(rcs[i] ==$scope.roomconfig[k].id){
        // 												$scope.roomconfig[k].ischecked= true;
        // 												$scope.roomconfig[k].rtconfignum=rcsums[i];
        // 											}
        // 										};
        // 									};
        //
        // 								}else{
        // 									$scope.jsondata=null;
        // 								};
        // 							});
        // 						}else{
        // 							$scope.jsondata={rtname:'',rtcode:'',rtdprice:'',rthprice:''};
        // 						};
        // 					};
        // 					return null;
        // 				});
        // };
        // return null;
        // });
    };
    $scope.cancel = function() {
        $scope.closeThisDialog(null);
    }
    $scope.update = function() {
        if ($scope.myForm.$valid) {
            if ($scope.choseArr) {
                $scope.jsondata.rtconfig = $scope.choseArr;
            }
            if ($scope.chosestr) {
                $scope.jsondata.rtconfig += "," + $scope.chosestr;
            }
            // $scope.jsondata.rtconfig= $scope.choseArr+","+$scope.chosestr;
            if ($scope.choseArrid) {
                $scope.jsondata.rtconfigids = $scope.choseArrid;
            }
            if ($scope.chosestrid) {
                $scope.jsondata.rtconfigids += "," + $scope.chosestrid
            }
            // $scope.jsondata.rtconfigids=$scope.choseArrid+","+$scope.chosestrid;
            if ($scope.choseArrsum) {
                $scope.jsondata.rtconfignum = $scope.choseArrsum;
            }
            if ($scope.chosestrsum) {
                $scope.jsondata.rtconfignum += "," + $scope.chosestrsum
            }
            // $scope.jsondata.rtconfignum=$scope.choseArrsum +","+$scope.chosestrsum;
            if ($scope.updateId != null && $scope.updateId != "") {
                $scope.jsondata.id = $scope.updateId;

                $sails.put("/hroomtype/" + $scope.jsondata.id, $scope.jsondata)
                    .success(function(data) {
                        if (data) {
                            $scope.closeThisDialog(data);
                        } else {
                            dialog.notify(data.msg, 'error');
                        }
                    })
                    .error(function(data) {
                        dialog.notify(data.msg, 'error');
                    });
                // settingService.updateRoomModel($scope.jsondata).then(function(data){
                // 	if (data.data.code==200) {
                // 		$scope.closeThisDialog(data);
                // 	}else{
                // 		dialog.notify(data.data.msg, 'error');
                // 		// alert(data.data.msg);data.data.msg
                // 	};
                // });
            } else {
                $sails.post("/hroomtype", $scope.jsondata)
                    .success(function(data) {
                        if (data) {
                            $scope.closeThisDialog(data);
                            dialog.notify("新增成功!", 'success');
                        }
                    })
                    .error(function(data) {
                        dialog.notify(data.msg, 'error');
                    });
                // settingService.postRoomModel($scope.jsondata).then(function(data){
                // 	if (data.data.code==200) {
                // 		$scope.closeThisDialog(data);
                // 	}else{
                // 		dialog.notify(data.data.msg, 'error');
                // 	};
                // });
            }
        } else {
            $scope.myForm.submitted = true;
        }
    };
    $scope.getroomconfigs();
}]);
