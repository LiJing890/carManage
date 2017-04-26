'use strict';

var roomCheckServices = angular.module('roomManageApp').factory('roomCheckServices', ['$http', function ($http) {
  return {
    getHotelBuildList: function () {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hBuilding/getlist',{ params: {page:'1',rows:'999',order:'bname',sort:'asc'}}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getHotelFloorList: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hFloor/getlist',{ params: {page:'1',rows:'999',h_b_id:data,order:'floor',sort:'asc'}}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getHotelRoomList: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRoom/getlist',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getlistWithCustomer: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRoom/getlistWithCustomer',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getHotelRoomInfo: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getCustomerByRoomId/' + data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getHotelRoomtypeList: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRoomtype/getlist',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getpreCheckIn: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/preCheckIn/'+ data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    checkIn: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hCustomer/checkin', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    extendRoom: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hCustomer/extendroom', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    changeroom: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hCustomer/changeroom', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    renewRoomCard: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hCustomer/renewRoomCard', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    checkOut: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hCustomer/checkout', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    updateStatus: function (data) {
      var result = $http.post(lpt_host + '/zeus/ws/hotel/hRoom/updateStatus', data).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    geRoomConfigList: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRoomconfig/getlist',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    gehCustomerList: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getlist',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getCustomerInOutNum: function (userid) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRecord/getCustomerInOutNum/' + userid).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getRoomStatic: function () {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hStatistic/roomStatic').then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getParkingInfo: function (cardid) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getParkingInfo/' + cardid).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getRoomconfig: function (data) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hRoomconfig/getRoomconfig',{ params: data}).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    existCustomerByCardNo: function (cardid) {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/existCustomerByCardNo/' + cardid).then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getMaxSerialNumber: function () {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getMaxSerialNumber').then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    },
    getMaxHecode: function () {
      var result = $http.get(lpt_host + '/zeus/ws/hotel/hCustomer/getMaxHecode').then(
        function (response) {
          return response;
        },
        function (response) {
          return response;
        }
      );
      return result;
    }
  }
}]);
