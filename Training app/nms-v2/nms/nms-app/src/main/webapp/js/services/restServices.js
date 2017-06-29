'use strict';

angular.module('nmsDemo.restServices', ['ngResource'])
    .factory('deviceService', function($resource) {
        return $resource('api/devices/:id' , {} , {
            query: { method: 'GET', isArray: true },
            get: { method: 'GET', params: { id:'@id' }, isArray: true }
        });
    })
    .factory('attributesService', function($resource){
        return $resource('api/devices/:id/attributes?type=:type', {}, {
            get: { method: 'GET', params: { id: '@id' }, isArray: true },
            put: { method: 'PUT', params: { id: '@id', type: '@type'}, isArray: true }
        });
    })
    .factory('deviceInfoService', function($resource){
        return $resource('api/devices/:id/info?type=:type', {}, {
            get: { method: 'GET', params: { id: '@id', type: '@type' }, isArray: true },
            put: { method: 'PUT', params: { id: '@id', type: '@type' }, isArray: true }
        });
    })    
    .factory('portAttributesService', function($resource){
        return $resource('api/devices/:id1/ports/:id2', {}, {
            get: { method: 'GET', params: { id1: '@id1',id2: '@id2'}, isArray: true },
            put: { method: 'PUT', params: { id1: '@id1',id2: '@id2'}, isArray: true }
        });
    })
    .factory('portAlarmService', function($resource){
        return $resource('api/devices/:id1/ports/:id2/alarms', {}, {
            get: { method: 'GET', params: { id1: '@id1',id2: '@id2'}, isArray: true },
            put: { method: 'PUT', params: { id1: '@id1',id2: '@id2'}, isArray: true }
        });
    })
    .factory('alarmService', function($resource) {
        return $resource('api/devices/:id/alarms?type=Device', {}, {
            get : { method : 'GET', params : { id : '@id' }, isArray : true }
        });
    })
    .factory('inventoryService', function($resource) {
        return $resource('api/devices/status' , {ignoreCache: '@ignoreCache'} , {
            query: { method: 'GET', isArray: true }
        });
    })
    .factory('alarmStatusService', function($resource) {
        return $resource('api/devices/alarms/status', {ignoreCache: '@ignoreCache'} , {
            query: { method: 'GET', isArray: true }
        });
    })
    .factory('relationService', function($http) {
        return {
            getRelation: function(id1, id2) {
                return $http({
                    url: "api/devices/relation",
                    method: "GET",
                    params: { "id1": id1 , "id2": id2 },
                });
            }
        }
    })
    ;

/*
Example:

var allDevices = deviceService.query({}, function(){
	console.log(allDevices);
});
	
var devicesOfId1 = deviceService.get({ id: 1 }, function(){
	console.log(devicesOfId1);
});

var dataOfId1 = attributesService.get({id: 1}, function(){
	console.log(dataOfId1);
});

var alarmOfId1 = alarmService.get({id: 1}, function(){
	console.log(alarmOfId1);
});
*/