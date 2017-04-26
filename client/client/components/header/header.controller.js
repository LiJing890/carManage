'use strict';

angular.module('lptApp')
  .controller('headerCtrl', function($rootScope, $scope, $location, dialog, systemAppService) {
    $scope.userSettingClick = function() {
      dialog.open({
        template: 'app/common/views/userSetting/userCenter.html',
        className: 'ngdialog-theme-default big-box',
        scope: $scope
      });
    };


    $scope.status = {
      isopen: false
    };

    $scope.message = {
      count: 0,
      items: []
    };

    
  });
