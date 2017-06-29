'use strict';

/* jasmine specs for controllers go here */
describe('NMS Training App services', function() {

    beforeEach(module('nmsDemo.utilService'));

    describe('UtilServices', function(){

        describe("processChartInfo sevice",function(){
            var returnedHealthData,expectHealthData,xGroup,unit;

            beforeEach(function(){

                 returnedHealthData = [
                        {"count":906,"name":"Critical"}
                        ,{"count":335,"name":"Major"}
                        ,{"count":554,"name":"Minor"}
                ];
                 expectHealthData = [
                    {"alarmType":"Critical","percent":50}
                    ,{"alarmType":"Major","percent":19}
                    ,{"alarmType":"Minor","percent":31}
                ];

                xGroup = 'alarmType';
                unit = 'percent';

            }) ;


            it('should return the correct customized data for alarm health data', inject(function(utilService) {
                expect(utilService.processChartInfo(returnedHealthData,xGroup,unit)).toEqual(expectHealthData);
            }));

        }) ;

        describe("convertToDetailsData",function(){
             var returnedData,expectData;

             beforeEach(function(){
                 returnedData = [
                     {"id":1,"validValues":[],"name":"Name","value":"switch 1","type":"String","group":"Generic Config","isReadable":true,"isWritable":false}
                     ,{"id":2,"validValues":[],"name":"Status","value":"ACTIVE","type":"String","group":"Generic Config","isReadable":true,"isWritable":false}
                     ,{"id":3,"validValues":[],"name":"IP Address","value":"127.0.0.1","type":"String","group":"Generic Config","isReadable":true,"isWritable":false}
                     ,{"id":4,"validValues":[],"name":"Read Only Example","value":"readOnlyValue","type":"String","group":"Specific Config","isReadable":true,"isWritable":false}
                     ,{"id":5,"validValues":[],"name":"Writable Example","type":"String","group":"Specific Config","isReadable":true,"isWritable":true}] ;

                 expectData = [
                     { groupName : 'Generic Config', attributes : [ { id : 1, validValues : [  ], name : 'Name', value : 'switch 1', type : 'String', isReadable : true, isWritable : false }, { id : 2, validValues : [  ], name : 'Status', value : 'ACTIVE', type : 'String', isReadable : true, isWritable : false }, { id : 3, validValues : [  ], name : 'IP Address', value : '127.0.0.1', type : 'String', isReadable : true, isWritable : false } ] },
                     { groupName : 'Specific Config', attributes : [ { id : 4, validValues : [  ], name : 'Read Only Example', value : 'readOnlyValue', type : 'String', isReadable : true, isWritable : false }, { id : 5, validValues : [  ], name : 'Writable Example', type : 'String', isReadable : true, isWritable : true } ] } ];
             });

            it('should return the correct customized data for alarm health data', inject(function(utilService) {
                expect(utilService.convertToDetailsData(returnedData,"group")).toEqual(expectData);
            }))

        })

        });

});
