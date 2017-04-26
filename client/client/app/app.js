'use strict';

angular.module('lptApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'w5c.validator',
  'ngSails',
  'roomManageApp',
  'commonApp',
  'ui.bootstrap.datetimepicker'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider,$tooltipProvider, ngDialogProvider,$sailsProvider) {
    //        $urlRouterProvider
    //            .otherwise('/opCenter');
    $sailsProvider.url ='http://localhost:1304';
    $locationProvider.html5Mode(true);
    ngDialogProvider.setDefaults({
      className: 'ngdialog-theme-default',
      plain: false,
      showClose: true,
      closeByDocument: false,
      closeByEscape: true
    });

     $tooltipProvider.options({
      placement: 'right',
      animation: true,
      popupDelay: 0,
      appendToBody: false
    })
})


  .directive('whenScrolled', function() {
    return function(scope, elm, attr) {
      var raw = elm[0];
      elm.bind('scroll', function() {
        if (raw.scrollTop+raw.offsetHeight >= raw.scrollHeight) {
          scope.$apply(attr.whenScrolled);
        }
      });
    };
  });
