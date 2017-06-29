'use strict';

angular.module('nmsDemo.utilService', [])
    .factory('utilService', function() {
        return {
			convertToDetailsData : function(metadata, groupPropertyName) {
				var groupObjs = [];
				
				for (var i = 0; i < metadata.length; ++i) {
					var obj = metadata[i];
					
					var group = null;
					
					for (var j = 0; j < groupObjs.length; ++j) {
						var gr = groupObjs[j];
						if (gr.groupName === obj[groupPropertyName]) {
							group = gr;
							break;
						}
					}
					
					if (group === null) {
						group = {};
						group.groupName = obj[groupPropertyName];
						group.attributes = [];
						groupObjs.push(group);
					}
					
					var attribute = {};
					
					for (var prop in obj) {
						if (prop !== groupPropertyName) {
							attribute[prop] = obj[prop];
						}
					}
					
					group.attributes.push(attribute);		
				}
				
				return groupObjs;
			}, // end convertToDetailsData
			
			updateDetails : function(convertedMetadatas, originalAttrs, groupPropertyName) {
				var arr = [];
				
				for (var i = 0; i < convertedMetadatas.length; ++i) {
					var groupAttrs = convertedMetadatas[i];
					
					for (var j = 0; j < groupAttrs.attributes.length; ++j) {
						var attr = groupAttrs.attributes[j];
						
						attr.groupName = groupAttrs.groupName;
						
						console.log(attr);
						arr.push(attr);
					}
				}
				
				return arr;
			},

            processChartInfo : function(returnedData,xGroup,unit){
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
                    customReturnedData[i][xGroup] = returnedData[i].name;
                    customReturnedData[i][unit] = returnedData[i].count;
                }
                return customReturnedData;
            },
            
            setAttrForNode : function(node, attrObj){
            	var li = $(node.li);
				li.attr(attrObj);
            }

        }

    });