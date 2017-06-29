'use strict';

nmsDemo.controller('NewChartCtrl', function($scope,$rootScope,alarmStatusService,inventoryService,$location,$compile,$routeParams) {
    $scope.model={};
    //piechart////////////////////////////////////////
    $scope.piechart = {};
    //config options
    $scope.piechart.options = {
        //"title":"Alarm Health",
        "donut":false,
        "titleFont":"16px sans-serif",
        "titleColor":"blue",
        "width": "400",
        "height": "400",
        "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        "showLabels" : true,
        "labelsFont" : "13px Arial",
        "labelsColor" : "back"

    };

    //config name and value
    $scope.piechart.name="name";
    $scope.piechart.value="count";

    $scope.drawPieChart = function() {
        // var a=[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":1,"name":"Minor"}];
        var alarmInfo = alarmStatusService.query({ignoreCache: Math.random()}, function() {
            $scope.piechart.data =  alarmInfo;
        });
    };
    $scope.drawPieChart();


    //event onSelect
    $scope.piechart.onSelect = function(d){
        console.log(d.data);
        $location.url("/content?tab=alarm");
    }


    //donutchart////////////////////////////////
   
    $scope.donutchart = {};
    //config options
    $scope.donutchart.options = {
        "title":"Inventory Status",
        "donut":true,
        "titleFont":"16px sans-serif",
        "titleColor":"blue",
        "width": "400",
        "height": "400",
        "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        "showLabels" : false,
        "labelsFont" : "13px Arial",
        "labelsColor" : "back",

    };
    //config name and value
    $scope.donutchart.name="name";
    $scope.donutchart.value="count";
    $scope.drawDonutChart = function() {
       // var a=[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":1,"name":"Minor"}];
      
         var inventoryInfo = inventoryService.query({ignoreCache: Math.random()}, function() {
            $scope.donutchart.data =  inventoryInfo;

        }); 
    };
   $scope.drawDonutChart();
     //event onSelect
    $scope.donutchart.onSelect = function(d){
        console.log(d.data);
        $location.path("/content");
    }


   //barChart ////////////////////////////////////////       
    $scope.barchart = {};
    //config options
    $scope.barchart.options = {
       // "title":"Alarm Health Summary",
        "titleFont":"16px sans-serif",
       "titleColor":"blue",
       "width": "400",
       "height": "400",
        "color":["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        "showLabels" : true,
         "labelsFont" : "13px Arial",
         "labelsColor" : "black",
        "xLabel":"--Alarm type-->",
        "yLabel":"--Count-->"
    };
    //config name and value
    $scope.barchart.name="name";
    $scope.barchart.value="count";
    //data
      $scope.drawBarChart = function() {
       // var a=[{"count":123,"name":"Critical"},{"count":59,"name":"Major"},{"count":1,"name":"Minor"}];
        var alarmInfo = alarmStatusService.query({ignoreCache: Math.random()}, function() {
            $scope.barchart.data =  alarmInfo;
        });
    };
   $scope.drawBarChart();
       
   //event onSelect
    $scope.barchart.onSelect = function(d){
        console.log(d);
         $location.url("/content?tab=alarm");
    }

    //gauge chart/////////////////////////////////

    $scope.gaugechart = {};
    //config options
    $scope.gaugechart.options = {
       // "title":"Total Alarm",
       	// "name" : "Alarm",
         "titleFont":"16px sans-serif",
         "titleColor":"blue",
         "size": "350",
         "minorTicks": "5",
         "min": 0,
         "max": 5000
 


    };

    $scope.gaugechart.name="Alarm";

   var total = function(dataSet) {
				var total = 0;
				for (var i = 0; i < dataSet.length; i++) {
					total += dataSet[i].count;
				}
				return total;
			}
   $scope.drawGaugeChart = function() {

        var alarmInfo = alarmStatusService.query({ignoreCache: Math.random()}, function() {
            $scope.gaugechart.value = total(alarmInfo);
            
        });
    };
   $scope.drawGaugeChart();


    $scope.$on("ALARM", function(event, args){
        console.log("---------------------------------------");
        console.log(event);
        console.log(args);
        // there is alarm update! re-create the chart!
        $scope.drawDonutChart();
        $scope.drawPieChart();
        $scope.drawBarChart();
        $scope.drawGaugeChart();

        console.log("---------------------------------------");
    });

    ////dashboard

    var pie=$compile('<div align="center"><npie-chart chart="piechart" /></div>')($scope);
    var donut=$compile('<div align="center"><npie-chart chart="donutchart" /></div>')($scope);
    var bar=$compile('<div align="center" style="margin-top: 50px"><nbar-chart chart="barchart" /></div>')($scope);
    var gauge=$compile('<div align="center" style="margin-top: 50px"><gauge-chart chart="gaugechart" /></div>')($scope);
    var pieTitle=$compile("<span>{{'alarmHealthSummary' | i18next}}</span>")($scope);
    var donutTitle=$compile("<span>{{'inventoryStatusSummary' | i18next}}</span>")($scope);
    var barTitle=$compile("<span>{{'alarmHealthSummary' | i18next}}</span>")($scope);
    var gaugeTitle=$compile("<span>{{'totalAlarm' | i18next}}</span>")($scope);
    $scope.model.data=[
        {
            widgetTitle : pieTitle, //Title of the widget
            widgetId: "Widget1", //unique id for the widget
            widgetContent: pie //content for the widget
        },
        {
            widgetTitle : donutTitle, //Title of the widget
            widgetId: "Widget2", //unique id for the widget
            widgetContent: donut //content for the widget
        },
        {
            widgetTitle : barTitle, //Title of the widget
            widgetId: "Widget3", //unique id for the widget
            widgetContent: bar //content for the widget
        },
        {
            widgetTitle : gaugeTitle, //Title of the widget
            widgetId: "Widget4", //unique id for the widget
            widgetContent: gauge //content for the widget
        }

    ]

    $scope.changeColor=function(){
        function getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }
            return color;
        }
        var   color=[];

        for (var i = 0; i < 5; i++) {
            color[i]= getRandomColor();
        }

        $scope.donutchart.options.color=color;
        $scope.barchart.options.color=color;
        $scope.piechart.options.color=color;
    }

    $scope.show=function(){
       angular.element('.sDashboard li').show("fold", {}, 300);
       
    }
  
  /*  
    $scope.hiddenWidget=function(){
    	$scope.widget={};
		var h=$('.sDashboard li');
		angular.forEach(h, function(i, li){
			if(angular.element(li).css("display")=="none"){
	    		$scope.widget[i]=$(li).attr('id');
	    	};
			
		});	 
    } */
	$scope.debug=$routeParams['debug'];;

	
       
});
