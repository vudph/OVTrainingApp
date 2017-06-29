'use strict';

/* jasmine specs for controllers go here */
describe('NMS Training App controllers', function() {
    
    beforeEach(module('nmsDemo')); 
    
    describe('MainCtrl', function(){
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new(); 
            ctrl = $controller('MainCtrl', {$scope: scope});
        }));


        it('should set the default value of liveUpdateChecked', function() {
            expect(scope.liveUpdateChecked).toBeDefined();
        });
    });

    describe('ChartCtrl',function(){
       var chartScope, chartCtrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/devices/alarms/status').respond([]);
            $httpBackend.expectGET('api/devices/status').respond([]);
            chartScope = $rootScope.$new();
            chartCtrl = $controller('ChartCtrl', {$scope: chartScope});

        }));

       it("should set the initial value for alarmHealthData.xGroup as 'alarmType'",function(){
           expect(chartScope.alarmHealthData.xGroup).toEqual("alarmType");
       });

        it("should ste the initial value for alarmHealthData.unit as 'percent' ",function(){
            expect(chartScope.alarmHealthData.unit).toEqual("percent");
        });

        it("should set the initial value for alarmHealthData.unit as '#/content?tab=config' ",function(){
            expect(chartScope.alarmHealthData.url).toEqual("#/content?tab=alarm");
        });

        it("should set the initial value for inventoryData.xGroup as 'status'",function(){
            expect(chartScope.inventoryData.xGroup).toEqual("status");
        });

        it("should set the initial value for inventoryData.unit as 'percent'",function(){
            expect(chartScope.inventoryData.unit).toEqual("percent");
        });

        it("should set the initial value for inventoryData.url as 'status'",function(){
            expect(chartScope.inventoryData.url).toEqual("#/content?tab=config");
        });
    });

    describe('ContentCtrl', function(){
        var scope, ctrl, $httpBackend, routeParams;

        beforeEach(inject(function(_$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('api/devices').respond([]);
        }));

        it('should set the value of tabConfig', inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('ContentCtrl', {$scope: scope});
            expect(scope.tabConfig).toBeDefined();
        }));

        it('should set the value of tabAlarm', inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            ctrl = $controller('ContentCtrl', {$scope: scope});
            expect(scope.tabAlarm).toBeDefined();
        }));

        it('tab Config should be selected if routeParams contain tab=config', inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            routeParams = { tab : "config"};
            ctrl = $controller('ContentCtrl', {$scope: scope, $routeParams: routeParams});
            scope.$broadcast('$routeChangeSuccess');
            expect(scope.selectedTab).toEqual(scope.tabConfig);
        }));

        it('tab Alarm should be selected if routeParams contain tab=alarm', inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            routeParams = { tab : "alarm"};
            ctrl = $controller('ContentCtrl', {$scope: scope, $routeParams: routeParams});
            scope.$broadcast('$routeChangeSuccess');
            expect(scope.selectedTab).toEqual(scope.tabAlarm);
        }));

        it('tab Config should be selected', inject(function($rootScope, $controller) {
            scope = $rootScope.$new();
            routeParams = { tab : "undefined"};
            ctrl = $controller('ContentCtrl', {$scope: scope, $routeParams: routeParams});
            scope.$broadcast('$routeChangeSuccess');
            expect(scope.selectedTab).toEqual(scope.tabAlarm);
        }));

    });

});
