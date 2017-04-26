'use strict';

var rcgoodsController=angular.module('roomManageApp');
rcgoodsController.controller('rcgoods',['$scope','settingService','dialog','$sails',function ($scope,settingService,dialog,$sails) {
	var vm=this;
vm.jsondata={rcname:"",rccode:"",mcprice:"",rcprice:"",rcstatus:"0",rctype:""};
	vm.updateRcGood=function(){
		vm.jsondata = $scope.rc;

		// settingService.getRoomGoodById($scope.rc.id).then(function(data){
		// 	if (data.data.code==200) {
		// 		vm.jsondata.rcname=data.data.body.rcname;
		// 		vm.jsondata.rccode=data.data.body.rccode;
		// 		vm.jsondata.mcprice=data.data.body.mcprice;
		// 		vm.jsondata.rcprice=data.data.body.rcprice;
		// 		vm.jsondata.rcstatus=data.data.body.rcstatus;
		// 		vm.jsondata.rctype=$scope.rc.rctype;
		// 	};
		// });
	};
	vm.update=function(){
		if($scope.myForm.$valid){
			if (!$scope.rc) {
				vm.jsondata.rctype=$scope.rctype;
				$sails.post("/hroomconfig",vm.jsondata)
				.success(function (data) {
					if(data){
						$scope.closeThisDialog(data);
						dialog.notify("新增成功!", 'success');
					}
				})
				.error(function (data) {
					dialog.notify(data.msg, 'error');
				});
				// settingService.saveRoomGood(vm.jsondata).then(function(data){
				// 	if (data.data.code==200) {
				// 		$scope.closeThisDialog(data);
				// 		dialog.notify("新增成功!", 'success');
				// 	}else{
				// 		// alert(data.data.msg);
				// 		dialog.notify(ata.data.msg, 'error');
				// 	};
				// });
			}else{
				vm.jsondata.id=$scope.rc.id;
				vm.jsondata.rctype=$scope.rctype;
				$sails.put("/hroomconfig/"+vm.jsondata.id,vm.jsondata)
				.success(function (data) {
					if(data){
						$scope.closeThisDialog(data);
					}
					else{
						dialog.notify(data.msg, 'error');
					}
				})
				.error(function (data) {
					dialog.notify(data.msg, 'error');
				});
				// settingService.updateRoomGoodById(vm.jsondata).then(function(data){
				// 	if (data.data.code==200) {
				// 		$scope.closeThisDialog(data);
				// 		dialog.notify("编辑成功!", 'success');
				// 	}else{
				// 		dialog.notify(ata.data.msg, 'error');
				//
				// 	};
				// });
			}
		}else{
			$scope.myForm.submitted = true;
		}

	};
	vm.cancel = function(){
		$scope.closeThisDialog(null);
	};
	if ($scope.rc!=null) {
		vm.updateRcGood();
	};
}]);
