'use strict';

angular.module('roomManageApp').controller('roomcommutectrl', ['$scope','$http','settingService', 'roomCheckServices','$rootScope','dialog',function($scope,$http,settingService, roomCheckServices,$rootScope,dialog){
	//LIST数据获取
	 $scope.roomlist=[];
	 $scope.freeroom="";
	 $scope.userid=$rootScope.user.userid;
 	 $scope.username=$rootScope.user.username;
 	 $scope.isworktime=false;
	var  postData = {
		userid:user.userid,
        currpage:1,
        totalPage: 10,
        order:"intime"
    };
 // 重新获取数据条目
        var reGetProducts = function(){
        	 postData = {
        	 	userid:user.userid,
        	 	order:"intime",
                page: $scope.paginationConf.totalItems==0?1:$scope.paginationConf.currentPage,
                rows: $scope.paginationConf.itemsPerPage
            };
			 settingService.getCustomerList(postData).then(function (response) {
			  var list =[];
			  if (response.data.code==200&&response.data.body.totalRecords>0) {
				   $scope.roomlist=response.data.body.data;
				   // for (var i = response.data[0].body.data.length - 1; i >= 0; i--) {
				   // 			list=response.data[0].body.data[i]
				   // 			list.timedif=list.parkestate==1?'':(new Date(list.outtime)-new Date(list.entrytime))/1000/60/60;
				   // 			$scope.roomlist.push(list);
				   // };
				   $scope.paginationConf.totalItems = response.data.body.totalRecords;
			   };
			  });
			 settingService.getFreeRoom({}).then(function(datafr){
			 	if (datafr.status==200) {
			 		$scope.freeroom=datafr.data.body;
			 	};
			 });
			 	 settingService.getStatusByUserId($scope.userid).then(function(datafr){
			 	if (datafr.status==200&&datafr.data.code==200) {
			 		if (datafr.data.body.dutystatus==true) {
		 				document.getElementById("isatwork").style.display="none";
						document.getElementById("isoffwork").style.display="block";
						$scope.isworktime=true;
						$scope.worktime=datafr.data.body.startdate;

			 		}else{
						document.getElementById("isoffwork").style.display="none";
						document.getElementById("isatwork").style.display="block";
			 		};
			 		//$scope.freeroom=datafr.data.body.freenum;
			 	};
			 });
        };
 		
        // 配置分页基本参数
        $scope.paginationConf = {
            currentPage: 1,
            itemsPerPage: 10,
            //以下实际应用中可注释
          // totalItems:800
        };
 		//上班
 		$scope.atwork=function(){
			settingService.postAtwork({"userid":$scope.userid,"username":$scope.username}).then(function (response){
				if(response.data.code==200){
					document.getElementById("isatwork").style.display="none";
					document.getElementById("isoffwork").style.display="block";
					$scope.isworktime=true;
					$scope.worktime=response.data.body.startdate;
					$scope.offtime="";
					// $scope.worktime=
					dialog.notify('欢迎上班！', 'success');
					// $scope.Isatwork=false;
				}else if (response.data.code==500) {
					dialog.notify(response.data.msg, 'error');
				};
			});
 		};
 		//下班
 		$scope.offwork=function(){
			settingService.postOffduty({"userid":$scope.userid,"username":$scope.username}).then(function (response){
				if(response.data.code==200){
					document.getElementById("isoffwork").style.display="none";
					document.getElementById("isatwork").style.display="block";
					$scope.isworktime=true;
					$scope.offtime=response.data.body.enddate;
					// $scope.Isatwork=true;
					dialog.notify('辛苦了，下班愉快！', 'success');
				}else if (response.data.code==500) {
					dialog.notify(response.data.msg, 'error');
				};
			});
 		};

		//当班收取押金和开房数
		$scope.getCustomerInOutNum = function(){
			roomCheckServices.getCustomerInOutNum(user.userid).then(function (response) {
				if(response.data.code == "200"){
					$scope.customerInOutNum = response.data.body;
				}
			});
		};

		$scope.getCustomerInOutNum();
        // 通过$watch currentPage和itemperPage 当他们一变化的时候，重新获取数据条目
        $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
 
        
}]);