/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('roomManageApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngAnimate',
    'ui.router',
    'ui.bootstrap',
    'ngDialog',
    'ngCityPicker',
    'tm.pagination',
    'flow',
    'ngNotify',
    'w5c.validator',
    'commonApp'
]).constant('roomRoutes', [{
        name: 'roomManage',
        url: '/roomManage',
        templateUrl: '/app/roomManage/index.html',
        menu: '客房中心',
        childMenus: [{
            name: 'roomManage.setting',
            url: '/setting',
            templateUrl: '/app/roomManage/views/setting.html',
            menu: '房型设置'
        },{
            name: 'roomManage.roomFloor',
            url: '/roomFloor',
            templateUrl: '/app/roomManage/views/setting/roomFloor.html',
            menu: '客房设置'
        },
        {
            name: 'roomManage.setUp',
            url: '/setUp',
            templateUrl: '/app/roomManage/views/setting/setUp.html',
            menu: '结算设置'
        },
            {
                name: 'roomManage.roomcheck',
                url: '/roomcheck',
                templateUrl: '/app/roomManage/views/roomCheck/roomcheck.html',
                menu: '房间查询'
            },
            {
                name: 'roomManage.settledout',
                url: '/settledout',
                templateUrl: '/app/roomManage/views/settledOut/settledout.html',
                menu: '入住退房'
            },
            {
                name: 'roomManage.customerCheck',
                url: '/customerCheck',
                templateUrl: '/app/roomManage/views/customerCheck/customerCheck.html',
                menu: '入住查询'
            },
            {
                name: 'roomManage.commute',
                url: '/commute',
                templateUrl: '/app/roomManage/views/commute/commute.html',
                menu: '上班下班'
            }]
    }
    ]
)
    .config(['$stateProvider', '$urlRouterProvider', 'roomRoutes', function ($stateProvider, $urlRouterProvider, roomRoutes) {
        var menu, childMenu;
        for (var n in  roomRoutes) {
            menu = roomRoutes[n];
            $stateProvider.state(menu.name, {
                url: menu.url,
                templateUrl: menu.templateUrl,
                menu: menu.menu
            });
            if (menu.childMenus.length > 0) {
                for (var c in  menu.childMenus) {
                    childMenu = menu.childMenus[c];
                    $stateProvider.state(childMenu.name, {
                        url: childMenu.url,
                        templateUrl: childMenu.templateUrl,
                        menu: childMenu.menu
                    });
                }
            }
        }
    }])
    .run(['$rootScope', '$filter', 'roomRoutes', function ($rootScope, $filter, roomRoutes) {
        /**
         * 应用模块第一次加载的时候，进行应用和菜单的注册
         */
        $rootScope.$on('appService.apps.init', function () {
            var appModel = {
                applicationid: '',
                applicationname: '客房管理',
                appurl: '/roomManage',
                appicon: 'guest-room',
                apporder: '3',
                descn: '客房管理应用模块',
                status: '1'
            };
            var initMenus = function (app) {
                for (var n in roomRoutes) {
                    var menu = roomRoutes[n];
                    var rootMenuModel = {
                        menuid: '',//菜单ID（修改时为必填）
                        menuname: menu.menu,//菜单名称
                        pmenuid: '0',//上级菜单ID
                        menuurl: menu.url,//菜单页面链接
                        menuorder: '',//菜单排序
                        menudesc: menu.templateUrl,//菜单描述
                        menuparam: menu.name,
                        status: 1, //菜单状态
                        applicationid: app.applicationid,//所属应用ID
                        applicationname: app.applicationname
                    };
                    systemAppService.menuService.registerMenu(rootMenuModel, function (rootMenu) {
                        if (menu.childMenus.length > 0) {
                            for (var c in menu.childMenus) {
                                var childMenu = menu.childMenus[c];
                                var menuModel = {
                                    menuid: '',//菜单ID（修改时为必填
                                    menuname: childMenu.menu,//菜单名称
                                    pmenuid: rootMenu.menuid,//上级菜单ID
                                    menuurl: childMenu.url,//菜单页面链接
                                    menuorder: '',//菜单排序
                                    menudesc: childMenu.templateUrl,//菜单描述
                                    menuparam: childMenu.name,
                                    status: 1, //菜单状态
                                    applicationid: app.applicationid,//所属应用ID
                                    applicationname: app.applicationname
                                };
                                systemAppService.menuService.registerMenu(menuModel);
                            }
                        }
                    });
                }
            };
            systemAppService.appService.registerApp(appModel, initMenus);
        });

        /**
         * 应用模块加载
         */
        (function () {
            var currentAppModule = null;
            $rootScope.roomMenus = [];
            var user = {
              id:1,
              username:"admin",
                password:"123456"
            };
            $rootScope.user = user;
            // 获取本应用模块

            var loadAppModule = function () {
                var currentAppMenus = [];
                // 获取本应用模块菜单
                var loadAppMenus = function () {
                    var menu, n;
                    for (n in currentAppMenus) {
                        menu = currentAppMenus[n];
                        if (menu.menuparam.indexOf('.') > 0) {
                            $rootScope.roomMenus.push({
                                href: '/' + menu.menuparam.split('.')[0] + '/' + menu.menuparam.split('.')[1],
                                name: menu.menuparam.split('.')[1],
                                menu: menu.menuname
                            });
                        }
                    }
                }
            }
        })();
    }])
    .controller('roomManageIndexCtrl', ['$scope', '$location', 'settingService', function ($scope, $location, settingService) {
        function locationChange(){
            // if ($location.path() == '/roomManage') {
            //     if ($scope.roomMenus && $scope.roomMenus.length > 0) {
            //         $location.path($scope.roomMenus[0].href);
            //     }
            // }
            if ($location.path() == '/roomManage') {
              $location.path('/roomManage/settledout');
                // if ($scope.roomMenus && $scope.roomMenus.length > 0) {
                //     settingService.getStatusByUserId(user.userid).then(function(datafr){
                //         if (datafr.status==200&&datafr.data.code==200) {
                //             if (datafr.data.body.dutystatus!=true) {
                //                 $location.path("/roomManage/commute");
                //                 return;
                //             }
                //         }
                //         $location.path($scope.roomMenus[0].href);
                //     });
                // }
            }
        }
        locationChange();

        $scope.$on('$locationChangeSuccess',locationChange);

        $scope.navs = $scope.roomMenus;
        $scope.isActive = function (route) {
            return route === $location.path();
        };
    }]);
