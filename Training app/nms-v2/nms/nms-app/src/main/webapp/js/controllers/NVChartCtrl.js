'use strict';

nmsDemo.controller('NVChartCtrl', function($scope, $location, inventoryService, alarmStatusService, utilService){
  
   ////pieChart
    $scope.piechart = {};
    $scope.piechart.xGroup = "name";
    $scope.piechart.unit = "count";
    $scope.piechart.options = {
       "title":"Alarm Health Summary",
       "titleFont":"16px sans-serif",
       "titleColor":"blue",
       "width": "400",
       "height": "400",
       "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
       "showLabels" : true,
       "donut":true,
       "pieLabelsOutside":true,
        
    };

    $scope.drawPieChart = function() {
       // var a=[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":1,"name":"Minor"}];
        var alarmInfo = alarmStatusService.query({}, function() {
            $scope.piechart.data =  alarmInfo;
        });
    };
   $scope.drawPieChart();

    //event onStateChange
    $scope.piechart.onStateChange = function(e){
        console.log('New State:', JSON.stringify(e));
    }
        
     //event onSelect
    $scope.piechart.onSelect = function(e){
        console.log(e.data);
    }


  //////barchart
    $scope.barchart = {};
    $scope.barchart.xGroup = "name";
    $scope.barchart.unit = "count";
    $scope.barchart.options = {
        "title":"Alarm Health Summary",
        "titleFont":"16px sans-serif",
        "titleColor":"blue",
        "width": "400",
        "height": "400",
        "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        "showValues" : true,
        "tooltips":true,   
    };

    $scope.drawBarChart = function() {
       // var a=[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":1,"name":"Minor"}];
        var alarmInfo = alarmStatusService.query({}, function() {
            $scope.barchart.data =  alarmInfo;
        });
    };
   $scope.drawBarChart();


  
	////inventoryData
    $scope.inventoryData = {};
    $scope.inventoryData.xGroup = "name";
    $scope.inventoryData.unit = "count";
    $scope.inventoryData.options = {
       "title":"Inventory Status Summary",
       "titleFont":"16px sans-serif",
       "titleColor":"blue",
       "width": "400",
       "height": "400",
       "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
       "showLabels" : true,
       "donut":false,
       "pieLabelsOutside":false,
        
    };

    $scope.drawInventoryPieChart = function() {
               //[{"count":2,"name":"OFFLINE"},{"count":4,"name":"ACTIVE"}]
        var inventoryInfo = inventoryService.query({}, function() {
            $scope.inventoryData.data =  inventoryInfo;

        }); 
    };
   $scope.drawInventoryPieChart();

    //event onStateChange
    $scope.inventoryData.onStateChange = function(e){
        console.log('New State:', JSON.stringify(e));
    }
        
     //event onSelect
    $scope.inventoryData.onSelect = function(e){
        console.log(e.data);
    }

});