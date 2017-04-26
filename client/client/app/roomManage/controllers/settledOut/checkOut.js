'use strict';

var app = angular.module('roomManageApp');

app.controller('roomcheckout', ['$document', '$scope', '$http', 'dialog', 'roomCheckServices', function($document, $scope, $http, dialog, roomCheckServices) {
    var vm = this;

    vm.jsondata = {
        id: "", //id
        h_r_id: "", //房间号id
        cusname: "", //客户姓名
        cussex: "", //客户性别
        cuscard: "", //客户身份证
        tel: "", //客户电话
        birthplace: "", //户籍地址
        cardno: "", //卡号
        intime: "", //入住时间
        outime: "", //预计离房时间
        actuallefttime: "", //实际离开时间
        deposit: 0, //押金
        cost: 0, //消费金额
        loss: 0, //损耗金额
        discount: 0, //优惠金额
        totalmoney: 0, //总费用
        costtype: "", //消费方式,1：押金，2：入住金额
        status: "", //客户入住状态
        remark: "", //备注
        create_by: "", //创建人
        create_name: "", //创建人名称
        create_date: "", //创建时间
        update_by: "", //修改人
        update_name: "", //修改人名称
        update_date: "", //修改时间
        delflag: "", //删除标志
        del_date: "", //删除时间
        vehiclenumber: "", //车辆牌照
        hycode: "", //客户押金流水号
        hecode: "", //客户结算流水号
        priceday: "", //单价-天
        pricehour: "", //单价-小时
        roomno: "", //房间号
        rtname: "", //房间类型
        rtid: "", //房型ID
        roomConfigId: "", //配置赔偿标准ID
        roomConfigNum: "", //
        ktamt: 0, //
        ktnum: 0, //
        datasource: "", //数据来源
    };

    //空调消费总额
    vm.ktamttotal = 0;
    //总消费金额
    vm.totalprice = 0;

    vm.costtypeChange = function() {
        if (vm.jsondata.costtype == "1") {
            $scope.price = vm.jsondata.priceday;
        } else {
            $scope.price = vm.jsondata.pricehour;
        }
    }

    //获取押金流水号
    vm.getMaxHecode = function() {
        roomCheckServices.getMaxHecode().then(function(response) {
            if (response.data.code == "200") {
                vm.jsondata.hecode = response.data.body;
            }
        });
    }

    //客房初始化信息
    vm.getHotelRoomInfo = function(roomid) {
        roomCheckServices.getHotelRoomInfo(roomid).then(function(response) {
            if (response.data.code == "200") {
                vm.jsondata = response.data.body.customer;
                vm.totalpriceChange();
                vm.getMaxHecode();
            }
        });
    }

    //查询零食
    vm.geRoomLSList = function() {
        var queryRoomConfig = {
            rtid: $scope.roominfo.rid,
            rctype: "1" //配置类型（1：零食2：家具）
        };
        roomCheckServices.getRoomconfig(queryRoomConfig).then(function(response) {
            if (response.data.code == "200") {
                vm.roomLSList = response.data.body;
            }
        });
    }

    //查询家具
    vm.geRoomJJList = function() {
        var queryRoomConfig = {
            rtid: $scope.roominfo.rid,
            rctype: "2", //配置类型（1：零食2：家具）
        };
        roomCheckServices.getRoomconfig(queryRoomConfig).then(function(response) {
            if (response.data.code == "200") {
                vm.roomJJList = response.data.body;
            }
        });
    }

    //计算家具赔偿金额
    vm.lossJJChange = function() {
        var totalloss = 0;
        for (var i = 0; i < vm.roomJJList.length; i++) {
            if (vm.roomJJList[i].isCheck) {
                if (!isNaN(vm.roomJJList[i].num)) {
                    totalloss = parseFloat(totalloss) + parseFloat(vm.roomJJList[i].rcprice) * parseFloat(vm.roomJJList[i].num);
                }
            }
        }
        vm.lossjj = totalloss;
        vm.totalpriceChange();
    }

    //计算零食消费金额
    vm.lossLSChange = function() {
        var totalloss = 0;
        for (var i = 0; i < vm.roomLSList.length; i++) {
            if (vm.roomLSList[i].isCheck) {
                if (!isNaN(vm.roomLSList[i].num)) {
                    totalloss = parseFloat(totalloss) + parseFloat(vm.roomLSList[i].rcprice) * parseFloat(vm.roomLSList[i].num);
                }
            }
        }
        vm.lossls = totalloss;
        vm.totalpriceChange();
    }

    //计算空调消费
    vm.ktChange = function() {
        vm.ktamttotal = 0;
        if (vm.jsondata.ktamt != null && vm.jsondata.ktnum != null && vm.jsondata.ktamt != "" && vm.jsondata.ktnum != "" && !isNaN(vm.jsondata.ktamt) && !isNaN(vm.jsondata.ktnum)) {
            vm.ktamttotal = parseFloat(vm.jsondata.ktamt) * parseFloat(vm.jsondata.ktnum);
        }
        vm.totalpriceChange();
    }

    //计算总消费金额和找零
    vm.totalpriceChange = function() {
        if (!vm.lossjj) {
            vm.lossjj = 0;
        }
        if (!vm.lossls) {
            vm.lossls = 0;
        }
        if (!vm.ktamttotal) {
            vm.ktamttotal = 0;
        }
        if (!vm.jsondata.cost) {
            vm.jsondata.cost = 0;
        }
        if (!vm.jsondata.discount) {
            vm.jsondata.discount = 0;
        }

        //总消费金额
        vm.jsondata.totalmoney = parseFloat(vm.lossjj) + parseFloat(vm.lossls) + parseFloat(vm.ktamttotal) + parseFloat(vm.jsondata.cost) - parseFloat(vm.jsondata.discount);
        //找零
        $scope.changed = parseFloat(vm.jsondata.totalmoney) - parseFloat(vm.jsondata.deposit);
    }

    //新增OR修改
    vm.checkOut = function() {
        // vm.printData();
        if ($scope.myForm.$valid) {
            vm.jsondata.update_by = user.userid;
            vm.jsondata.update_name = user.realname;
            roomCheckServices.checkOut(vm.jsondata).then(function(response) {
                if (response.data.code == "200") {
                    vm.printData();
                    $scope.closeThisDialog(response.data);
                    vm.audioPlayOut();
                } else {
                    dialog.notify(response.data.msg, 'error');
                    $scope.closeThisDialog(null);
                }
            });
        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function() {
        $scope.closeThisDialog(null);
    }

    vm.pinCard = function() {
        var wrcard = window.wrcard;
        var carid = wrcard.getCardId(window.comPort);
        if (vm.jsondata.cardno != carid) {
            // alert("房卡卡号不一致");
            dialog.notify("房卡卡号不一致！", 'error');
        } else {
            var result = wrcard.woff_Card();
            if (result == 1) {
                // alert('销卡成功！');
                dialog.notify("销卡成功！", 'success');
                vm.audioPlayZK();
            } else {
                // alert('销卡失败！');
                dialog.notify("销卡失败！", 'error');
            }
        }
    }

    vm.printData = function() {
        var LODOP = getLodop();
        //行间距开始
        var rownum = 39;
        //行间距累加
        var rowmaSpacing = 25;
        LODOP.PRINT_INIT("");
        LODOP.SET_PRINT_PAGESIZE(1, 2300, 940, "");

        LODOP.ADD_PRINT_TEXT(11, 22, 150, 25, vm.curentTime());
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(8, 273, 200, 30, "雁城物流园旅馆账单");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 14);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(11, 587, 135, 25, "NO:" + vm.jsondata.hecode);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 13, 80, 25, "地    址：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 87, 185, 25, "衡阳市雁城物流园");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 284, 80, 25, "客人姓名：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 352, 185, 25, vm.jsondata.cusname);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 549, 80, 25, "电    话：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 622, 100, 25, "0734-2652188");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 13, 80, 25, "身份证号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 87, 185, 25, vm.jsondata.cuscard);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 284, 80, 25, "房    号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 352, 185, 25, vm.jsondata.roomno);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(rownum, 549, 80, 25, "房    价：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 622, 100, 25, vm.jsondata.priceday + " 元/天");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 13, 80, 25, "入住时间：");
        LODOP.ADD_PRINT_TEXT(rownum, 87, 185, 25, vm.jsondata.intime);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(rownum, 284, 80, 25, "退房时间：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 352, 185, 25, vm.jsondata.actuallefttime);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
        LODOP.ADD_PRINT_TEXT(rownum, 549, 80, 25, "车 牌 号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 622, 100, 25, vm.jsondata.vehiclenumber);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing - 10;

        LODOP.ADD_PRINT_TEXT(rownum, 1, 739, 20, "-------------------------------------------------------------------------------------------------------------------------");
        rownum = rownum + rowmaSpacing - 10;

        LODOP.ADD_PRINT_TEXT(rownum, 41, 100, 25, "输入时间");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "项目");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, "消费");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "支付");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "说明");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "押金");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, "0.00");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, vm.jsondata.deposit);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "房费");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, vm.jsondata.cost);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "0.00");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        if (vm.ktamttotal > 0) {
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "空调费×" + vm.jsondata.ktnum);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, vm.ktamttotal);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "0.00");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            rownum = rownum + rowmaSpacing;
        }

        if (vm.jsondata.discount > 0) {
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "优惠金额");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, "-" + vm.jsondata.discount);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "0.00");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            rownum = rownum + rowmaSpacing;
        }

        if (vm.lossjj > 0) {
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "房间损耗");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, vm.lossjj);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "0.00");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            rownum = rownum + rowmaSpacing;
        }

        if (vm.lossls > 0) {
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "消费品消费");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, vm.lossls);
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, "0.00");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
            LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
            rownum = rownum + rowmaSpacing;
        }

        LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 24, 150, 25, vm.curentTime());
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 177, 100, 25, "结账款");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 314, 100, 25, "0.00");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 447, 100, 25, $scope.changed);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 584, 100, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 24, 100, 25, "支付总额：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 105, 150, 25, vm.jsondata.deposit);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 270, 100, 25, "消费总额：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 350, 100, 25, vm.jsondata.totalmoney);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 500, 100, 25, "付款方式：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 570, 100, 25, "现金 " + $scope.changed);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        rownum = rownum + rowmaSpacing;

        LODOP.ADD_PRINT_TEXT(rownum, 24, 100, 25, "收 银 员：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 105, 150, 25, user.username);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        // LODOP.ADD_PRINT_TEXT(rownum,270,100,25,"消费总额：");
        // LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
        // LODOP.ADD_PRINT_TEXT(rownum,350,100,25,"0.00");
        // LODOP.SET_PRINT_STYLEA(0,"FontSize",10);
        LODOP.ADD_PRINT_TEXT(rownum, 500, 100, 25, "宾客签名：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(rownum, 570, 100, 25, "");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

        LODOP.PREVIEW();
        // LODOP.PRINT();
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

    vm.audioPlayZK = function() {
        var audioZK = $document.find('#audioZK')[0];
        audioZK.play();
    }

    vm.audioPlayOut = function() {
        var audioOut = $document.find('#audioOut')[0];
        audioOut.play();
    }

    vm.geRoomLSList();
    vm.geRoomJJList();
    vm.getHotelRoomInfo($scope.roominfo.id);

}]);
