'use strict';
//房型设置分页查询
var settingService = angular.module('roomManageApp').factory('settingService', ['$http', function ($http) {
  return {
    getroommodels : function (q) {
      var stallList = $http.get(lpt_host+ '/zeus/ws/hotel/hRoomtype/getlist',{params: q}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    getcommutelist:function(q){
    	var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRecord/getlist',{params: q}).then(
       function (response) {
         return response;
       },
       function (response) {
         return response;
       }
       );

      return stallList;
    },
    postAtwork:function(q){
    	var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRecord/atwork',q).then(
       function (response) {
         return response;
       },
       function (response) {
         return response;
       }
       );                      

      return stallList;
    },
    postOffduty:function(q){
    	var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRecord/offduty',q).then(
       function (response) {
         return response;
       },
       function (response) {
         return response;
       }
       );

      return stallList;
    },
    getRcList:function(q){
    	var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRoomconfig/getlist',{params: q}).then(
       function (response) {
         return response;
       },
       function (response) {
         return response;
       }
       );

      return stallList;
    },
    getCustomerList:function(q){
      var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRecord/getCustomerList',{params: q}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    postRoomModel:function(q){
      var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRoomtype/save',q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
      updateRoomModel:function(q){
      var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRoomtype/update',q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    getRoomModelById:function(q){
      var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRoomtype/gethRoomtype/'+q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    deleteRoomConfigById:function(q){
      var stallList=$http.delete(lpt_host+ '/zeus/ws/hotel/hRoomconfig/delete/'+q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    deleteRoomModelById:function(q){
      var stallList=$http.delete(lpt_host+ '/zeus/ws/hotel/hRoomtype/delete/'+q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    saveRoomGood:function(q){
      var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRoomconfig/save',q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    getRoomGoodById:function(q){
      var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRoomconfig/gethRoomconfig/'+q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    updateRoomGoodById:function(q){
      var stallList=$http.post(lpt_host+ '/zeus/ws/hotel/hRoomconfig/update',q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    getStatusByUserId:function(q){
      var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hRecord/getDutyStatus/'+q).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
        );

      return stallList;
    },
    getFreeRoom:function(q){
    var stallList=$http.get(lpt_host+ '/zeus/ws/hotel/hStatistic/roomStatic').then(
      function (response) {
        return response;
      },
      function (response) {
        return response;
      }
      );

    return stallList;
  }
  }
}]);