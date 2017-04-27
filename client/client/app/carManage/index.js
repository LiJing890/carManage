/**
 * Created by libinqi on 2015/5/26.
 */

'use strict';

angular.module('carManageApp', [
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
    ]).constant('carRoutes', [{
        name: 'carManage',
        url: '/carManage',
        templateUrl: '/app/carManage/index.html',
        menu: '汽车修理',
        childMenus: [{
                name: 'carManage.custom',
                url: '/custom',
                templateUrl: '/app/carManage/views/custom/custom.html',
                menu: '客户信息'
            }, {
                name: 'carManage.roomFloor',
                url: '/roomFloor',
                templateUrl: '/app/carManage/views/setting/roomFloor.html',
                menu: '客房设置'
            },
            {
                name: 'carManage.setUp',
                url: '/setUp',
                templateUrl: '/app/carManage/views/setting/setUp.html',
                menu: '结算设置'
            },
            {
                name: 'carManage.roomcheck',
                url: '/roomcheck',
                templateUrl: '/app/carManage/views/roomCheck/roomcheck.html',
                menu: '房间查询'
            },
            {
                name: 'carManage.settledout',
                url: '/settledout',
                templateUrl: '/app/carManage/views/settledOut/settledout.html',
                menu: '入住退房'
            },
            {
                name: 'carManage.customerCheck',
                url: '/customerCheck',
                templateUrl: '/app/carManage/views/customerCheck/customerCheck.html',
                menu: '入住查询'
            }
        ]
    }])
    .config(['$stateProvider', '$urlRouterProvider', 'carRoutes', function ($stateProvider, $urlRouterProvider, carRoutes) {
        var menu, childMenu;
        for (var n in carRoutes) {
            menu = carRoutes[n];
            $stateProvider.state(menu.name, {
                url: menu.url,
                templateUrl: menu.templateUrl,
                menu: menu.menu
            });
            if (menu.childMenus.length > 0) {
                for (var c in menu.childMenus) {
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
    .run(['$rootScope', '$filter', 'carRoutes', function ($rootScope, $filter, carRoutes) {
        /**
         * 应用模块第一次加载的时候，进行应用和菜单的注册
         */
        $rootScope.$on('appService.apps.init', function () {
            var appModel = {
                applicationid: '',
                applicationname: '客房管理',
                appurl: '/carManage',
                appicon: 'guest-room',
                apporder: '3',
                descn: '客房管理应用模块',
                status: '1'
            };
            var initMenus = function (app) {
                for (var n in carRoutes) {
                    var menu = carRoutes[n];
                    var rootMenuModel = {
                        menuid: '', //菜单ID（修改时为必填）
                        menuname: menu.menu, //菜单名称
                        pmenuid: '0', //上级菜单ID
                        menuurl: menu.url, //菜单页面链接
                        menuorder: '', //菜单排序
                        menudesc: menu.templateUrl, //菜单描述
                        menuparam: menu.name,
                        status: 1, //菜单状态
                        applicationid: app.applicationid, //所属应用ID
                        applicationname: app.applicationname
                    };
                    systemAppService.menuService.registerMenu(rootMenuModel, function (rootMenu) {
                        if (menu.childMenus.length > 0) {
                            for (var c in menu.childMenus) {
                                var childMenu = menu.childMenus[c];
                                var menuModel = {
                                    menuid: '', //菜单ID（修改时为必填
                                    menuname: childMenu.menu, //菜单名称
                                    pmenuid: rootMenu.menuid, //上级菜单ID
                                    menuurl: childMenu.url, //菜单页面链接
                                    menuorder: '', //菜单排序
                                    menudesc: childMenu.templateUrl, //菜单描述
                                    menuparam: childMenu.name,
                                    status: 1, //菜单状态
                                    applicationid: app.applicationid, //所属应用ID
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
            $rootScope.carMenus = [];
            var user = {
                id: 1,
                username: "admin",
                password: "123456"
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
                            $rootScope.carMenus.push({
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
    .controller('carManageIndexCtrl', ['$scope', '$location', 'settingService', function ($scope, $location, settingService) {
        function locationChange() {
            // if ($location.path() == '/carManage') {
            //     if ($scope.carMenus && $scope.carMenus.length > 0) {
            //         $location.path($scope.carMenus[0].href);
            //     }
            // }
            if ($location.path() == '/carManage') {
                $location.path('/carManage/custom');
                // if ($scope.carMenus && $scope.carMenus.length > 0) {
                //     settingService.getStatusByUserId(user.userid).then(function(datafr){
                //         if (datafr.status==200&&datafr.data.code==200) {
                //             if (datafr.data.body.dutystatus!=true) {
                //                 $location.path("/carManage/commute");
                //                 return;
                //             }
                //         }
                //         $location.path($scope.carMenus[0].href);
                //     });
                // }
            }
        }
        locationChange();

        $scope.$on('$locationChangeSuccess', locationChange);

        $scope.navs = $scope.carMenus;
        $scope.isActive = function (route) {
            return route === $location.path();
        };
    }]);