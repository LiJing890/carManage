'use strict';

var app = angular.module('roomManageApp');

app.controller('roomcheckin', ['$document', '$scope', '$http', '$filter', 'dialog', '$sails', function($document, $scope, $http, $filter, dialog, $sails) {
    var vm = this;

    vm.jsondata = {
        h_r_id: "", //房间号id
        cusname: "", //客户姓名
        cussex: "1", //客户性别（1男2女）
        cuscard: "", //客户身份证
        tel: "", //客户电话
        birthplace: "", //客户籍贯
        cardno: "", //卡号
        intime: "", //入住时间
        outime: "", //预计离房时间
        costtype: "1", //消费方式
        priceday: "", //单价-天
        pricehour: "", //单价-小时
        roomno: "", //房间号
        rtname: "", //房间类型
        vehiclenumber: "", //车辆牌照
        deposit: "", //押金
        cname1: "", //同行人1姓名
        csex1: "", //同行人1性别
        ccard1: "", //同行人2身份证号
        cname2: "", //同行人1姓名
        csex2: "", //同行人1性别
        ccard2: "", //同行人2身份证号
        create_by: user.userid, //创建人
        create_name: user.realname //创建人名称
    };

    vm.queryHotelRoomType = {
        page: '1',
        rows: '999',
        id: ""
    };

    //获取押金流水号
    vm.getMaxSerialNumber = function() {
        roomCheckServices.getMaxSerialNumber().then(function(response) {
            if (response.data.code == "200") {
                vm.jsondata.hycode = response.data.body;
            }
        });
    }

    //房间类型查询
    vm.getHotelRoomtypeList = function() {
        $sails.get("/hroomtype/" + vm.queryHotelRoomType.id)
            .success(function(data) {
                vm.hotelRoomtype = data;
                if (vm.hotelRoomtype != null) {
                    vm.jsondata.priceday = vm.hotelRoomtype.rtdprice;
                    vm.jsondata.pricehour = vm.hotelRoomtype.rthprice;
                    //默认设置
                    $scope.price = vm.jsondata.priceday;
                }
            })
            .error(function(data) {
                alert('error');
            });

        // roomCheckServices.getHotelRoomtypeList(vm.queryHotelRoomType).then(function (response) {
        //   if(response.data.code == "200"){
        //     vm.hotelRoomtype = response.data.body.data[0];
        //     if(vm.hotelRoomtype!=null){
        //       vm.jsondata.priceday = vm.hotelRoomtype.rtdprice;
        //       vm.jsondata.pricehour = vm.hotelRoomtype.rthprice;
        //       //默认设置
        //       $scope.price = vm.jsondata.priceday;
        //     }
        //   }
        // });
    }

    //查询车辆信息
    vm.getParkingInfo = function() {
        // var wrcard = window.wrcard;
        // vm.jsondata.cardno = wrcard.getCardId(window.comPort);
        vm.jsondata.cardno = 'yd123456';

        if (vm.jsondata.cardno && vm.jsondata.cardno != "0") {
            $sails.get("/hcard?cardno=" + vm.jsondata.cardno)
                .success(function(data) {
                    if (data[0].status == 0) {

                    } else {
                        dialog.notify("该房卡已开房，请更换其他房卡！", 'error');
                    }

                })
                .error(function(data) {
                    alert('error');
                });

            // roomCheckServices.existCustomerByCardNo(vm.jsondata.cardno).then(function (response) {
            //   if(response.data.code == "200"){
            //     roomCheckServices.getParkingInfo(vm.jsondata.cardno).then(function (response) {
            //       if(response.data.code == "200"){
            //         if(vm.jsondata.tel == ""){
            //           vm.jsondata.tel = response.data.body.telephonenumber;
            //           vm.gehCustomerList(vm.jsondata.tel);
            //         }
            //         vm.jsondata.vehiclenumber = response.data.body.vehiclenumber;
            //       }
            //     });
            //   }
            //   else{
            //     dialog.notify("该房卡已开房，请更换其他房卡！", 'error');
            //   }
            // });
        }
    }

    // vm.gehCustomerList = function(tel){
    //   if(tel && tel.length == 11){
    //     var data = {
    //       tel:tel,
    //       rows:1,
    //       page:1,
    //       order: 'intime',
    //       sort: 'DESC'
    //     }
    //     roomCheckServices.gehCustomerList(data).then(function (response) {
    //       if(response.data.code == "200"){
    //         var data = response.data.body.data;
    //         if(data && data.length > 0){
    //           vm.jsondata.cusname = data[0].cusname;
    //           vm.jsondata.cussex = data[0].cussex;
    //           vm.jsondata.cuscard = data[0].cuscard;
    //           vm.jsondata.birthplace = data[0].birthplace;
    //         }
    //         else{
    //           vm.jsondata.cusname = "";
    //           // vm.jsondata.cussex = "";
    //           vm.jsondata.cuscard = "";
    //           vm.jsondata.birthplace = "";
    //         }
    //       }
    //     });
    //   }
    // }

    vm.costtypeChange = function() {
        if (vm.jsondata.costtype == "1") {
            $scope.price = vm.jsondata.priceday;
        } else {
            $scope.price = vm.jsondata.pricehour;
        }
    }

    //客房初始化信息
    vm.getpreCheckIn = function(roomno) {
        roomCheckServices.getpreCheckIn(roomno).then(function(response) {
            if (response.data.code == "200") {
                vm.jsondata = response.data.body;
            }
        });
    }

    //新增OR修改
    vm.save = function() {
        if ($scope.myForm.$valid) {
            // var card = {
            //   nRoom: vm.jsondata.roomno.substring(1),
            //   Wstartdate:'000000000000',
            //   Wenddate: $filter('formatDate')(vm.outime, 'YYYYMMDDHHmm'),
            //   Vioce: '1',
            //   Obt: '0',
            //   Op: "8888",
            //   nCode: '1',
            //   jLift: '0'
            // };
            // var wrcard = window.wrcard;
            // var result = wrcard.w_Card(card.nRoom, card.Wstartdate, card.Wenddate, card.Vioce, card.Obt, card.Op, card.nCode, card.jLift);
            var result = 1;
            if (result == 1) {
                // alert('写卡成功！');
                dialog.notify("写卡成功！", 'success');
                vm.audioPlayZK();
            } else {
                // alert('写卡失败！');
                dialog.notify("写卡失败！", 'error');
                return;
            }
            vm.jsondata.outime = vm.dateToString(vm.outime);

            $sails.post("/hcustomer", vm.jsondata)
                .success(function(data) {
                    vm.roomData = {
                        id: vm.jsondata.h_r_id,
                        rstatus: 2
                    }
                    $sails.put("/hroom/" + vm.roomData.id, vm.roomData)
                        .success(function(data) {
                            $scope.closeThisDialog(data);
                        })
                        .error(function(data) {
                            dialog.notify('操作失败', 'error');
                            $scope.closeThisDialog(null);
                        });
                })
                .error(function(data) {
                    dialog.notify('操作失败', 'error');
                    $scope.closeThisDialog(null);
                });
            // roomCheckServices.checkIn(vm.jsondata).then(function (response) {
            //   if(response.data.code == "200"){
            // vm.printData();
            //     $scope.closeThisDialog(response.data);
            //   }
            //   else{
            //     dialog.notify(response.data.msg, 'error');
            //     $scope.closeThisDialog(null);
            //   }
            // });
        }
        $scope.myForm.submitted = true;
    }



    vm.cancel = function() {
        $scope.closeThisDialog(null);
    }

    vm.curentTime = function() {
        var now = new Date();
        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日
        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //秒
        var clock = year + "-";
        if (month < 10) clock += "0";
        clock += month + "-";
        if (day < 10) clock += "0";
        clock += day + " ";
        if (hh < 10) clock += "0";
        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";
        if (ss < 10) clock += '0';
        clock += ss;
        return (clock);
    }

    vm.defTime = function() {
        var now = new Date();
        now = new Date(now.valueOf() + 1 * 24 * 60 * 60 * 1000);
        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日

        var clock = year + "-";
        if (month < 10) clock += "0";
        clock += month + "-";
        if (day < 10) clock += "0";
        clock += day + " ";

        clock += "13:00:00";
        return (clock);
    }

    vm.dateToString = function(datetime) {
        if (datetime != null) {
            var now = new Date(datetime);
            var year = now.getFullYear(); //年
            var month = now.getMonth() + 1; //月
            var day = now.getDate(); //日
            var hh = now.getHours(); //时
            var mm = now.getMinutes(); //分
            var ss = now.getSeconds(); //秒
            var clock = year + "-";
            if (month < 10) clock += "0";
            clock += month + "-";
            if (day < 10) clock += "0";
            clock += day + " ";
            if (hh < 10) clock += "0";
            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm + ":";
            if (ss < 10) clock += '0';
            clock += ss;
            return (clock);
        } else {
            return "";
        }
    }

    vm.wstartdate = function() {
        var now = new Date();

        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日

        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //秒

        var clock = year;
        if (month < 10)
            clock += "0";
        clock += month;
        if (day < 10)
            clock += "0";
        clock += day;
        // if(hh < 10)
        //     clock += "0";
        // clock += hh;
        // if (mm < 10)
        //   clock += '0';
        // clock += mm;
        // if (ss < 10) clock += '0';
        clock += "0000";
        return (clock);
    }

    vm.wenddate = function() {
        var now = new Date();

        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日

        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //秒

        var clock = year;

        if (month < 10)
            clock += "0";
        clock += month;
        if (day < 10)
            clock += "0";
        clock += day;
        if (hh < 10)
            clock += "0";
        clock += hh;
        if (mm < 10)
            clock += '0';
        clock += mm;
        // if (ss < 10) clock += '0';
        //   clock += ss;
        return (clock);
    }

    vm.readCard1 = function() {
        // var termb1 = window.termb;
        // var rtn = termb1.InitTermb(window.iDPort);
        vm.jsondata.cusname = '张三';
        vm.jsondata.cussex = 1;
        vm.jsondata.cuscard = '430321199101017878';
        vm.jsondata.birthplace = '湖南湘潭';
        // if(rtn==1){
        //   vm.jsondata.cusname = termb1.GetPeopleName();
        //   if (termb1.GetPeopleSex() == "男"){
        //       vm.jsondata.cussex = 1;
        //   }
        //   else if (termb1.GetPeopleSex() == "女"){
        //       vm.jsondata.cussex = 2;
        //   }
        //   vm.jsondata.cuscard = termb1.GetPeopleIDCode();
        //   vm.jsondata.birthplace = termb1.GetPeopleAddress();
        //
        // }
        // else{
        //   // console.log('设备初始化失败');
        //   dialog.notify("设备初始化失败！", 'error');
        // }
    }

    vm.readCard2 = function() {
        var termb2 = window.termb;
        var rtn = termb2.InitTermb(window.iDPort);
        if (rtn == 1) {
            vm.jsondata.cname1 = termb2.GetPeopleName();
            if (termb2.GetPeopleSex() == "男") {
                vm.jsondata.csex1 = 1;
            } else if (termb2.GetPeopleSex() == "女") {
                vm.jsondata.csex1 = 2;
            }
            vm.jsondata.ccard1 = termb2.GetPeopleIDCode();
        } else {
            // console.log('设备初始化失败');
            dialog.notify("设备初始化失败！", 'error');
        }
    }

    vm.readCard3 = function() {
        var termb3 = window.termb;
        var rtn = termb3.InitTermb(window.iDPort);
        if (rtn == 1) {
            vm.jsondata.cname2 = termb3.GetPeopleName();
            if (termb3.GetPeopleSex() == "男") {
                vm.jsondata.csex2 = 1;
            } else if (termb3.GetPeopleSex() == "女") {
                vm.jsondata.csex2 = 2;
            }
            vm.jsondata.ccard2 = termb3.GetPeopleIDCode();
        } else {
            // console.log('设备初始化失败');
            dialog.notify("设备初始化失败！", 'error');
        }
    }

    vm.audioPlayZK = function() {
        var audioZK = $document.find('#audioZK')[0];
        audioZK.play();
    }

    vm.printData = function() {
        var LODOP = getLodop();
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 940, "");
        LODOP.ADD_PRINT_TEXT(7, 403, 100, 25, "NO:" + vm.jsondata.hycode);
        LODOP.ADD_PRINT_TEXT(35, 149, 230, 30, "雁城物流园旅馆押金收据");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(71, 6, 80, 25, "开票单位：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(71, 279, 80, 25, "开票时间：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(71, 79, 180, 25, "衡阳雁城物流园");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(71, 352, 180, 25, vm.jsondata.intime);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(99, 6, 80, 25, "姓    名：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(99, 79, 180, 25, vm.jsondata.cusname);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(99, 279, 80, 25, "房    号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(99, 352, 180, 25, vm.jsondata.roomno);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(127, 6, 80, 25, "身份证号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(127, 79, 180, 25, vm.jsondata.cuscard);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(127, 279, 80, 25, "单    价：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(127, 352, 210, 25, $scope.price + " 元/天(入园停车优惠20元)");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(154, 6, 80, 25, "金    额：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(154, 79, 180, 25, vm.jsondata.deposit + " 元");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(154, 279, 80, 25, "车 牌 号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(154, 352, 180, 25, vm.jsondata.vehiclenumber);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(182, 6, 80, 25, "收 银 员：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(182, 79, 180, 25, user.username);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(182, 279, 80, 25, "宾客签名：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(182, 352, 180, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(209, 0, 580, 20, "_________________________________________________________________________________");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(230, 6, 557, 95, "备    注：\n1.开房时间在2小时内按半天收费，超过2小时按全天收费。\n2.退房时间为中午12点，超过13点按半价收费，超过16点按全价收费。\n3.请凭此收据于3个月内到雁城物流客房总台结清账务，否则过期作废。\n4.请妥善保管此收据，丢失概不负责。");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.PREVIEW();
        // LODOP.PRINT();
    }

    // vm.getpreCheckIn($scope.roominfo.roomno);
    vm.jsondata.h_r_id = $scope.roominfo.id;
    vm.queryHotelRoomType.id = $scope.roominfo.rid;
    vm.jsondata.roomno = $scope.roominfo.roomno;
    vm.jsondata.rtname = $scope.roominfo.rtname;
    vm.jsondata.intime = vm.curentTime();
    vm.outime = vm.defTime();
    // vm.getMaxSerialNumber();
    vm.getHotelRoomtypeList();
}]);
