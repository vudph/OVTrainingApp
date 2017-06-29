'use strict';

nmsDemo.controller('ContentCtrl', function ($scope, $routeParams, utilService, deviceService, alarmService, attributesService, relationService, portAttributesService, ngTableParams, portAlarmService, deviceInfoService, $filter) {
    $scope.selectedTab = null;
    $scope.selectedObj = null;
    $scope.selectedNode = null;
    $scope.selectedRowData = [];
    $scope.originalData = [];

    $scope.$on('$routeChangeSuccess', function (event, routeData) {
        $scope.currentRoute = $routeParams['tab'];

        if (typeof ($scope.currentRoute) === 'undefined') {
            //console.log("default to config tab");
            $scope.currentRoute = "config";
        }

        if ($scope.currentRoute === "config") {
            $scope.selectedTab = $scope.tabConfig;
        } else {
            $scope.selectedTab = $scope.tabAlarm;
        }
    });

    // Tree View
//    $scope.deviceTree = {};
    $scope.treeData = {
        data: [],
        onSelect: function (node) {
//      function getFullPath(node) {
//          if (!node.parent.data.title) {
//              return node.data.title;
//          } else {
//              return getFullPath(node.parent) + "/" + node.data.title;
//          }
//      }	
		
		
        	console.log('tree: ' + $scope.treeMenuItems);      	
            $scope.selectedObj = node.data;
            $scope.selectedNode = node;
            $scope.selectedTab.load();
        },

        onExpand: function (node) {
            $scope.tableParams.page = 1;
            var children = deviceService.get({ id: node.data.key }, function () {
                children.forEach(function (element, index, array) {
                   	element.dataObj = clone(element); 
                    element.title = element.name;
                    element.key = element.id;
                    
                });
                node.setLazyNodeStatus(DTNodeStatus_Ok);
                node.addChild(children);
            });
        },
        
        onDisable: function (node) {
	        if(node.data.status.toLowerCase() == $scope.status.offline.toLowerCase())     
	        {
	        	var attrObj = {'class': 'disable-node'};
	        	utilService.setAttrForNode(node, attrObj);
	        	node.data.isLazy = false;
	        	// $('nms-tree').trigger('onDisableStatus', node);
	        }
        	// utilService.setAttrForNode(node, attrObj);
        }
    };
    
	// $('nms-tree').on('onDisableStatus', function (event, node) {
// 		
	// });
	
    var navigateToPort = function (device, portName) {
        var childNodes = device.childList;
        if(childNodes){
            for (var i = 0; i < childNodes.length; i++) {
                var currentNode = childNodes[i];
                var nodeName = currentNode.data.name;
                if (nodeName === portName) {
//                    $scope.selectedTab = $scope.tabConfig;
                    currentNode.activate();
                }
            }
        }
    }

    $scope.$watch('deviceTree', function (tree) {
        if (tree) {
            $('nms-tree').on('onPortNavigate', function (event, row) {
                var pathName = row.source.split('/');
                var portName = pathName[pathName.length - 1];

                //Get the current activated devices
                var currentDevice = tree.getActiveNode();
                if (!currentDevice.childList) {
                    currentDevice.setLazyNodeStatus(DTNodeStatus_Loading);
                    var children = deviceService.get({ id: currentDevice.data.key }, function () {
                        children.forEach(function (element, index, array) {
                            element.title = element.name;
                            element.key = element.id;
                        });
                        currentDevice.setLazyNodeStatus(DTNodeStatus_Ok);
                        currentDevice.addChild(children);
                        navigateToPort(currentDevice, portName);
                    });
                } else {
                    navigateToPort(currentDevice, portName);
                }

            })
        }
    });

//


    // Load devices
    var allDevices = deviceService.query({}, function () {    	
        allDevices.forEach(function (element, index, array) {
        	// element.dataObj.obj = element;
        	// var dataObj = {};
        	// for(var prop in element){
        		// dataObj[prop] = element[prop];
        	// }       	
        	element.dataObj = clone(element);
            element.title = element.name;
            element.key = element.id;
            element.isLazy = true;
        });
        $scope.treeData.data = allDevices;
        console.log('all device ' + allDevices);
        console.log("Id of the first devices:", allDevices[0]);
    });
    $scope.loadSeletedObj =  function  (node) {
      
    }
    
	function clone(obj) {
	   var target = {};
	   for (var i in obj) {
		    if (obj.hasOwnProperty(i)) {
		     target[i] = obj[i];
		    }
	   }
	   return target;
	}


    // Table View
    $scope.alarms = [];

    $scope.columnsData = [
        {title: "Id", sortable: "id"},
        {title: "Severity", sortable: "severity"},
        {title: "Source", sortable: "source"},
    ];

    $scope.ngRowHover = 'ngRowHover';
    $scope.ngRowMouseOut = 'ngRowMouseOut';
    $scope.calculateRowClass = function (alarm) {
        var severityTypes;
        var rowClass = {};
        switch (angular.lowercase(alarm.severity)) {
            case 'major' :
                return {'major': true};
                // defineProp(rowClass, 'major', true);
                break;
            case 'minor' :
                return {'minor': true};
                // defineProp(rowClass, 'minor', true);
                break;
            case 'critical' :
                return {'critical': true};
                // defineProp(rowClass, 'critical', true);
                break;
            case 'warning' :
                return {'warning': true};
                // defineProp(rowClass, 'warning', true);
                break;

        }
        return rowClass;
    };

    $scope.tableParams = new ngTableParams({
        sorting: {
            id: 'asc'     // initial sorting
        },
        page: 1,
        total: $scope.alarms.length,
        count: 10
    });

    // watch for changes of parameters
    $scope.$watch('tableParams', function (params, oldVal) {
        // use build-in angular filter
        $scope.originalData = $scope.originalData || $scope.alarms;
        $scope.alarms = $scope.tableParams.filter ? $filter('filter')($scope.originalData, $scope.tableParams.filter) : $scope.originalData;
        $scope.alarms = params.sorting ? $filter('orderBy')($scope.alarms, params.orderBy()) : $scope.alarms;
        $scope.tableParams.total = $scope.alarms.length;
        var count = $scope.tableParams.count;
        var page = $scope.tableParams.page;
        var length = $scope.alarms.length;
        if(length/count < page-1){
            var offset;
            if(length > count && length%count == 0){
                 offset = (length/count - 1)*count;
            }else{
                 offset =  length/count > 1 ? Math.floor(length/count)*count : 0 ;
            }
            $scope.alarms = $scope.alarms.slice(offset, count + offset );
        }else{
            $scope.alarms = $scope.alarms.slice(((page - 1) * count), (page * count));
        }
    }, true);

    var navigateHandler = function (row) {
        $('nms-tree').trigger('onPortNavigate', [row]);
    };


    $scope.listMenuItems = [
        {
            name: 'navigate', handler: navigateHandler
        }
    ]

	$scope.status = {offline: 'OFFLINE', active: 'ACTIVE'};
	$scope.treeMenuItems =[
		{
			name : "Up", status: 'ACTIVE', handler : function (){
	            $scope.selectedObj.dataObj.status = this.status;
            	var objDataReturn = deviceInfoService.put({id: $scope.selectedObj.key, type: $scope.selectedObj.type}, $scope.selectedObj.dataObj, function(){
            		// alert('sucess');
					$scope.updateDataOfTabConfig();
            		
            	});
	            console.log('Activate: ' + $scope.selectedNode.data);          
	            var li = $($scope.selectedNode.li);
	            li.removeClass('disable-node');
			}
		},
		{
				name : "Down", status: 'OFFLINE', handler : function (){
	            // {"id":"51ef985a797f2101620cca6b","name":"switch1","type":"SWITCH","status":"ACTIVE"}
	            $scope.selectedObj.dataObj.status = this.status;
            	var objDataReturn = deviceInfoService.put({id: $scope.selectedObj.key, type: $scope.selectedObj.type}, $scope.selectedObj.dataObj, function(){
            		// alert('sucess');
            		console.log(objDataReturn);
					$scope.updateDataOfTabConfig();
            		
            	});

	            console.log('Deactivate: ' + $scope.selectedObj);          
	            var li = $($scope.selectedNode.li);
	            li.addClass('disable-node');
			}
		}
	]
    $scope.tabConfig = {
        title: "tabConfig",
        load: function () {
            //console.log('Select tab config');

            $scope.$emit("ALARM_LABEL", { visible: false });

            $scope.currentRoute = "config";
            $scope.selectedTab = this;
			$scope.updateDataOfTabConfig();
        }
    };
    
    $scope.updateDataOfTabConfig =  function(){
        if ($scope.selectedObj != null) {
            if ($scope.selectedObj.type == "ROUTER" || $scope.selectedObj.type == "SWITCH") {
                $scope.objDetails = attributesService.get({id: $scope.selectedObj.key}, function () {
                    $scope.detailsData = utilService.convertToDetailsData($scope.objDetails, "groupName");

                });
            } else if ($scope.selectedObj.type == "PORT") {
                $scope.objDetails = portAttributesService.get({id1: $scope.selectedNode.parent.data.key, id2: $scope.selectedObj.key}, function () {
                    $scope.detailsData = utilService.convertToDetailsData($scope.objDetails, "groupName");

                });
            }

        }   	
    }

    $scope.tabAlarm = {
        title: "tabAlarm",
        load: function () {
            //console.log('Select tab alarm');
            $scope.currentRoute = "alarm";
            $scope.selectedTab = this;
            if ($scope.selectedObj != null) {
                if ($scope.selectedObj.type == "ROUTER" || $scope.selectedObj.type == "SWITCH") {
	                var alarms = alarmService.get({id: $scope.selectedObj.key}, function () {
						$scope.loadAlarm(alarms);
	                });
                } else if ($scope.selectedObj.type == "PORT") {
                    var alarms = portAlarmService.get({id1: $scope.selectedNode.parent.data.key, id2: $scope.selectedObj.key}, function () {
                       $scope.loadAlarm(alarms);
                    });
                }
            }
        }
    };
    $scope.loadAlarm = function(alarms){
                    $scope.$emit("ALARM_LABEL", { visible: true, text: alarms.length });

                    $scope.dataFields = ['id', 'severity', 'source'];

//                    var testData = angular.copy(alarms[0]);
//                    testData.severity = "Minor";
//                    testData.source = "Switch 3";
//                    alarms.push(testData);


                    for (var i = 0; i < alarms.length; ++i) {
                        alarms[i]['id'] = +alarms[i]['id'];
                    }


                    $scope.originalData = angular.copy(alarms);

                    $scope.alarms = $scope.tableParams.filter ? $filter('filter')(alarms, $scope.tableParams.filter) : $scope.originalData;
                    $scope.alarms = $scope.tableParams.sorting ? $filter('orderBy')($scope.alarms, $scope.tableParams.orderBy()) : alarms;
                    $scope.tableParams.total = $scope.alarms.length;
                    $scope.alarms = $scope.alarms.slice((($scope.tableParams.page - 1) * $scope.tableParams.count), ($scope.tableParams.page * $scope.tableParams.count));
    }

    // update
    $scope.updateMetadata = function () {
        //console.log("update metadata!!");

        //console.log($scope.detailsData);

        var arr = utilService.updateDetails($scope.detailsData, $scope.objDetails, "groupName");

        console.log($scope.objDetails);

        var type = $scope.selectedObj.type == "PORT" ? 'port' : 'device'; 

        attributesService.put({id: $scope.selectedObj.key, type: type}, arr, function () {
            alert("Update successfully!");
        });
        
    };


    $scope.$on("ALARM", function (event, args) {
    	var path = args['source'];
    	
    	function isRootDeviceNode(treeNode) {
    		return treeNode.parent.data.key === "_1";
    	}
    	
    	if (path.indexOf($scope.selectedObj.name) > -1) {
    		// the path contains the parent device, update it 
    		if (isRootDeviceNode($scope.selectedNode)) {
	    		$scope.tabAlarm.load();	
	    	} else {
	    		// if the parent node contain the root (since we only have 2 level here), update it
				if (path.indexOf($scope.selectedNode.parent.data.name) > -1) {
		    		$scope.tabAlarm.load();	
				}
	    	}
		}
    });
    
    $scope.$on('$destroy', function () {
        $scope.$emit("ALARM_LABEL", { visible: false });
    });
});
