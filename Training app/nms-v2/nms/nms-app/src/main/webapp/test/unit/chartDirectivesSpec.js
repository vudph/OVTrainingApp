'use strict';

/* jasmine specs for directives go here */
describe('NMS Chart directives', function () {
    beforeEach(module('chart.chartDirective'));

    describe('npieChart', function () {
        var elm,
            elmBody,
            scope,
            elmScope;


        beforeEach(inject(function ($rootScope, $compile) {
            elmBody = angular.element(
                '<npie-chart chart="piechart" />'
            ).appendTo($('body'));

            scope = $rootScope.$new();
            scope.piechart = {};
            scope.piechart.options = {
                // "title":"Alarm Health Summary",
                "donut": false,
                "color": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
            };
            scope.piechart.name = "device";
            scope.piechart.value = "count";
            scope.piechart.data = [
                {"device": "Critical", "count": 123},
                {"device": "Major", "count": 40},
                {"device": "Minor", "count": 1}
            ];

            $compile(elmBody)(scope);

            scope.$digest();
            elm = elmBody.find('.slice');
            elmScope = elm.scope();

        }));

       it('should have 2 svg element appended', inject(function() {

           expect(elmBody.find('svg').length).toEqual(2);

       }));

       it('should have 3 slice element appended', inject(function() {

           expect(elmBody.find('.slice').length).toEqual(3);

       }));

       it('should have legend element appended', inject(function() {

           expect(elmBody.find('.legend').length).toEqual(1);

       }));

       it('should have path element appended to firt slice and the fist path have fill #1f77b4', inject(function() {
           var path=elm.eq(0).find('path');
           expect(path.length).toEqual(1);
           expect(path[0].getAttribute('fill')).toBe('#1f77b4')


       }));



        it('should open tooltip on mouse over and close tooltip on mouseout', inject(function ($document) {
            // event mouseover
            var eventover = document.createEvent("MouseEvents");
            eventover.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            elm[0].dispatchEvent(eventover);
            expect($document.find("#charttooltip").length).toEqual(1);


            // event mouseout
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("mouseout", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            elm[0].dispatchEvent(event);
            expect($document.find("#charttooltip").length).toEqual(0);

        }));

    })

    describe('nbarChart', function() {
      var   elmBody,
            svg,
            scope;
        beforeEach(inject(function($rootScope, $compile) {
            elmBody = angular.element(
                '<nbar-chart chart="barChart" />'
            ).appendTo($('body'));;

            scope = $rootScope;
            scope.barChart = {};
            scope.barChart.options = {
                "title":"Alarm Health Summary"
            };
            scope.barChart.name="device";
            scope.barChart.value="count";
            scope.barChart.data=[
                {"device":"Critical", "count":123},
                {"device":"Major", "count":40},
                {"device":"Major", "count":40},
                {"device":"Minor", "count":1}];

            $compile(elmBody)(scope);
            scope.$digest();
            svg = elmBody.find('svg');


        }));

        it('should draw two axes', inject(function() {
            var content=svg.children()[0];
            var child=content.childNodes;
            expect(child[0].getAttribute('class')).toBe('y axis');
            expect(child[1].getAttribute('class')).toBe('x axis');

        }));

        it('should have 4 rect element appended', inject(function() {

            expect(elmBody.find('.barchart').length).toEqual(4);

        }));

        it('should open tooltip on mouse over and close tooltip on mouseout', inject(function ($document) {
            var elm=elmBody.find('.barchart');
            // event mouseover
            var eventover = document.createEvent("MouseEvents");
            eventover.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            elm[0].dispatchEvent(eventover);
            expect($document.find("#charttooltip").length).toEqual(1);


            // event mouseout
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("mouseout", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            elm[0].dispatchEvent(event);
            expect($document.find("#charttooltip").length).toEqual(0);

        }));
    })



});
