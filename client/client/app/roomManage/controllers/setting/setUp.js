'use strict';

app.controller('setUpCtrl', ['$scope', '$http', 'dialog', '$sails', function($scope, $http, dialog, $sails) {
    var vm = this;

    vm.jsondata = {
        hbegintime: 0,
        hendtime: 0,
        housceamt: 0,
        hmendtime: 0,
        endtime: 0,
        hmhour: 0
    };

    //优惠设置查询
    vm.getPreferential = function() {
        $sails.get("/hdiscount")
            .success(function(data) {
                vm.jsondata = data[0];
            })
            .error(function(data) {
                alert('error');
            });
    }

    //新增OR修改
    vm.update = function() {
        if ($scope.myForm.$valid) {
            if (vm.jsondata.id && vm.jsondata.id != "undefind") {
                $sails.put("/hdiscount/" + vm.jsondata.id, vm.jsondata)
                    .success(function(data) {
                        vm.jsondata = data;
                        dialog.notify("保存成功!", 'success');
                    })
                    .error(function(data) {
                        alert('error');
                    });
            } else {
                $sails.post("/hdiscount", vm.jsondata)
                    .success(function(data) {
                        vm.jsondata = data;
                        dialog.notify("保存成功!", 'success');
                    })
                    .error(function(data) {
                        alert('error');
                    });
            }



        }
        $scope.myForm.submitted = true;
    }

    vm.cancel = function() {
        $scope.closeThisDialog(null);
    }

    vm.getPreferential();
}]);
