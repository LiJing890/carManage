/**
 * Created by libinqi on 2015/5/26.
 */

 'use strict';
 // if (!window.user) {
 //   window.user = userService.getUser();
 //   if (!window.user) {
 //     window.location.href = '/app/common/views/login.html';
 //   } else if (window.user.username != 'admin') {
 //     if (!window.user.permissions
 //       || !window.user.permissions.application
 //       || window.user.permissions.application.length == 0) {
 //       window.location.href = '/app/common/views/unAudit.html';
 //     }
 //   }
 // }

angular.module('commonApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router'
])
  .run(['$rootScope', '$filter', '$location', '$timeout', function($rootScope, $filter, $location, $timeout) {
    $location.path('/roomManage');

  }]);
