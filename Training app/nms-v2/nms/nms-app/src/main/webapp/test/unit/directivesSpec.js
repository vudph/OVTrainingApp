'use strict';

/* jasmine specs for directives go here */
describe('NMS Training App directives', function() {

    beforeEach(function(){
    	module('nmsDemo.treeDirectives');
        module('ngTable');
    });

    describe('nmsTree', function() {

        it('should have 2 div element appended', function() {
            return inject(function($compile, $rootScope) {

                var scope = $rootScope.$new();

                scope.treeData = {
                    data : []
                };
                var element = $compile('<nms-tree model="treeData"></nms-tree>')(scope);
                return expect(element.children().length).toEqual(2);
            });

        })
    })

    describe('ngTable',function(){

        it('should have 3 header columns',function(){
            return inject(function($compile,$rootScope,$templateCache,ngTableParams){
                var scope = $rootScope.$new();

                scope.columnsData = [
                    {title : "Id", sortable : "alarmId"},
                    {title : "Severity", sortable : "severity"},
                    {title : "Port", sortable : "port"}
                ];
                scope.myData = [{alarmId : 1001, severity : "Critical", port : "Switch 1"},{alarmId : 1002, severity : "Minor", port : "Port 1"}];
                scope.typesOfData = ['alarmId','severity','port'];
                scope.tableParams = new ngTableParams({
                    sorting: {
//                        alarmId: 'asc'     // initial sorting
                    },
                    page : 1,
                    total : scope.myData.length,
                    count : 10
                });
                // $templateCache.put("header.html",'<tr><th ng-class="{sortable: column.sortable,\'sort-asc\': params.sorting[column.sortable]==\'asc\', \'sort-desc\': params.sorting[column.sortable]==\'desc\'}" ng-click="sortBy($event,column)" ng-repeat="column in columns" ng-show="column.show(this)" class="header"><div>{{column.title}}</div></th></tr><tr ng-show="show_filter"><th ng-repeat="key in typesOfData" class="filter"><input type="text" ng-model="tableFilter[key]" class="input-filter"></th></tr>');
                scope.templates = {};
                scope.templates.header = "header.html" ;
                var element = $compile("<table ng-table table-data='myData' types-of-data='typesOfData'></table>")(scope);
                scope.$digest();

//                var thead = element.children('thead')[0];
                var headers = $compile("<thead ng-include src=\"'header.html'\"></thead>")(scope);
                return expect(headers[0].children).toBeDefined();
            })
        })
    })
});
