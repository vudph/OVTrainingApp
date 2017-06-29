'use strict';

nmsDemo.controller('ChartCtrl', function($scope, $location, inventoryService, alarmStatusService, utilService, $rootScope){
    //aaaaaaaaaaaaaaaaaaaaaa
	$scope.alarmHealthData = {};
	$scope.alarmHealthData.xGroup = "alarmType";
    $scope.alarmHealthData.unit = "percent";
	$scope.alarmHealthData.url = "#/content?tab=alarm";
    $scope.alarmHealthData.processInfo = function(dataObject,returnedData){
        var total = 0;
        for(var i = 0; i < returnedData.length ; i++){
            total += returnedData[i].count;
        }

        for(var i = 0 ; i < returnedData.length ; i++){
            returnedData[i].count = Math.round(returnedData[i].count / total * 100);
        }

        var customReturnedData = [];

        for(var i = 0; i < returnedData.length ; i++){
            customReturnedData[i] = {};
            customReturnedData[i][dataObject.xGroup] = returnedData[i].name;
            customReturnedData[i][dataObject.unit] = returnedData[i].count;
        }
        return customReturnedData;
    };

	$scope.getAlarmInfo = function() {
        //[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":94,"name":"Minor"}]

        var alarmInfo = alarmStatusService.query({}, function() {
            $scope.alarmHealthData.data =  utilService.processChartInfo(alarmInfo,$scope.alarmHealthData.xGroup,$scope.alarmHealthData.unit);;
        });
	};
    $scope.getAlarmInfo();

    $scope.$on("ALARM", function(event, args){
        console.log("---------------------------------------");
        console.log(event);
        console.log(args);
        // there is alarm update! re-create the chart!
        $scope.getAlarmInfo();
        console.log("---------------------------------------");    
    });

	$scope.inventoryData = {};
	$scope.inventoryData.xGroup = "status";
    $scope.inventoryData.unit = "percent";
    $scope.inventoryData.url = "#/content?tab=config";
	
	$scope.getInventoryInfo = function() {
        //[{"count":2,"name":"OFFLINE"},{"count":4,"name":"ACTIVE"}]
        var inventoryInfo = inventoryService.query({}, function() {
            $scope.inventoryData.data =  utilService.processChartInfo(inventoryInfo,$scope.inventoryData.xGroup,$scope.inventoryData.unit);;

        }); 
	};
    $scope.getInventoryInfo();
});

