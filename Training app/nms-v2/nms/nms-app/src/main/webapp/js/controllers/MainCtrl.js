'use strict';

nmsDemo.controller('MainCtrl', function($scope, $i18next, utilService, deviceService, attributesService, alarmService) {
    $scope.liveUpdateChecked = false;
    
    //change language
    $scope.langs= [
        {id:'en', name: 'english', selected: true},
        {id:'vi', name: 'vietnamese'}
    ];
    
    $scope.changeLang = function($event) {
        $i18next.options.lng=$scope.selectedLang;
    };
    
    $scope.selectedLang='en';
    
    $scope.$on('$viewContentLoaded', function(event, routeData) {
        var lngOpts = angular.element('#lngOpts');
        if(lngOpts[0].value !== $scope.selectedLang) {
            lngOpts[0].value=$scope.selectedLang;
        }
    }); 
    
    // live update
    $scope.sendAlarmsUpdate = function(event) {
        $scope.$broadcast("ALARM", event.data);
    }
    
    $scope.$watch('liveUpdateChecked', function(newVal){
        if (newVal) {
            $scope.openSocket();
        } else {
        	$scope.closeSocket();
        } 
    });
    
    $scope.openSocket = function() {
		// $.atmosphere.subscribe(
                // "api/events",
                // callback,
                // $.atmosphere.request = { transport:"websocket"});
        

		var onMessage = function(response) {
			var message = response.responseBody;
			var result;
			try {
				result = $.parseJSON(message);
				console.log("#############################");
				console.log(result);
				$scope.sendAlarmsUpdate({data: result});
				console.log("#############################");
			} catch (e) {
				console.log("An error ocurred while parsing the JSON Data: " + message.data + "; Error: " + e);
				return;
			}
		}
        
        //Function to be invoked when there is a response from the server
        $scope.eventCallback = $scope.eventCallback ? $scope.eventCallback : function (response) {
            $.atmosphere.log("info", ["response.state: " + response.state]);
            $.atmosphere.log("info", ["response.transport: " + response.transport]);
            $.atmosphere.log("info", ["response.status: " + response.status]);
          	$.atmosphere.log("info", ["response.transport: " + response.transport]); 
            
            if(response.state=='messageReceived'){
            	if(response.status == 200){
            		var data = response.responseBody;
            		if(data){
            			$.atmosphere.log("info", ["response.data: " + data]);
            		}
            	}
            } else {
            	console.log("--------------- ATMO STATE --------------");
            	console.log(response.state);
            	console.log("-----------------------------------------");
            }    
        }
        
        $scope.eventRequest = $scope.eventRequest ? $scope.eventRequest : {
			url : "api/events",
			// contentType : "application/json",
			logLevel : 'debug',
			transport : 'websocket',
			//fallbackTransport : 'long-polling',
			onMessage: onMessage
		}; 

		$.atmosphere.subscribe($scope.eventRequest);
		$.atmosphere.addCallback($scope.eventCallback);
    }
    
    $scope.closeSocket = function() {
    	$.atmosphere.unsubscribe();
    	console.log("CLOSE ATMOSPHERE!!!!!!");
    }
        
    // alarm label    
    $scope.alarmLabelVisible = false;
    $scope.alarmLabelText = 0;
    $scope.$on("ALARM_LABEL", function(event, args){
        console.log("=========== UPDATE LABEL VISIBILITY ================");
        $scope.alarmLabelVisible = args['visible'];
        if ($scope.alarmLabelVisible) {
            $scope.alarmLabelText = args['text'];
        }
    });
});
