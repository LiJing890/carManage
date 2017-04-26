'use strict';

var dialogController = angular.module('roomManageApp');

dialogController.controller('settingctrl', ['$scope', '$http', 'dialog', 'settingService', '$sails', function($scope, $http, dialog, settingService, $sails) {

    $scope.updateId = "";
    $scope.roomModellist = [];
    // 重新获取数据条目
    $scope.reGetProducts = function() {
        // 发送给后台的请求数据
        //   var postData = {
        //     page: $scope.paginationConf.totalItems==0?1:$scope.paginationConf.currentPage,
        //     rows: $scope.paginationConf.itemsPerPage
        //
        // };

        $sails.get("/hroomtype")
            .success(function(data) {
                $scope.roomModellist = data;
            })
            .error(function(data) {
                alert('error');
            });
        //   settingService.getroommodels().then(function (response) {
        //    if (response.status==200) {
        //     $scope.roomModellist=response.data.body.data;
        //     $scope.paginationConf.totalItems = response.data.body.totalRecords;
        // }else{
        //             //暂无数据。
        //         };
        //     });
    };

    $scope.clickToOpenmodel = function() {

        dialog.open({
            className: 'ngdialog-theme-default custom-box',
            template: 'app/roomManage/views/add.html',
            scope: $scope,
            preCloseCallback: function(data) {
                if (data != null) {
                    $scope.reGetProducts();
                    dialog.notify('添加成功！', 'success');
                }
            }
        });
    };
    $scope.clickToUpdatemodel = function(id) {
        $scope.updateId = id;
        dialog.open({
            className: 'ngdialog-theme-default custom-box',
            template: 'app/roomManage/views/add.html',
            scope: $scope,
            preCloseCallback: function(data) {
                if (data != null) {
                    $scope.reGetProducts();
                    dialog.notify('编辑成功！', 'success');
                } else {
                    $scope.updateId = "";
                }
            }
        });
    };
    $scope.clickToOpen = function() {

        dialog.open({
            className: 'ngdialog-theme-default custom-box',
            template: 'app/roomManage/views/goodsInstall.html'
        });
    };
    $scope.clickToDeletemodel = function(roomModel) {

        dialog.confirmDialog('确认是否要删除[' + roomModel.rtname + ']?').then(function(data) {
            if (data) {
                $sails.delete("/hroomtype/" + roomModel.id)
                    .success(function(data) {
                        $scope.reGetProducts();
                        dialog.notify('删除成功！', 'success');
                    })
                    .error(function(data) {
                        dialog.notify('删除失败！', 'error');
                    });
            }
        });

    };

    //分页处理


    // 配置分页基本参数
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10
            //以下实际应用中可注释
            // totalItems:800
    };
    $scope.reGetProducts();
    // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', $scope.reGetProducts);
}]);
