'use strict';

var nmsDemo = angular.module('nmsDemo', ['nmsDemo.chartDirectives', 'nmsDemo.treeDirectives', 'nmsDemo.utilService', 'nmsDemo.restServices', 'nmsDemo.detailsDirective', 'ui.bootstrap', 'ngTable', 'jm.i18next','nvd3.directives','chart.chartDirective','nmsDemo.dashboardDirective']);

//Route
nmsDemo.config(function($routeProvider) {
    $routeProvider.when('/content', {
        templateUrl : 'partials/content.html',
        controller : 'ContentCtrl'
    });
    $routeProvider.when('/nvChart', {
        templateUrl : 'partials/nvChart.html',
        controller : 'NVChartCtrl'
    });
     $routeProvider.when('/oldChart', {
        templateUrl : 'partials/chart.html',
        controller : 'ChartCtrl'
    });
    $routeProvider.when('/test', {
        templateUrl : 'partials/test.html',
        controller : 'TestCtrl'
    });
    $routeProvider.when('/chart', {
        templateUrl : 'partials/newChart.html',
        controller : 'NewChartCtrl',
    });
    $routeProvider.otherwise({
        templateUrl : 'partials/newChart.html',
        controller : 'NewChartCtrl',
        redirectTo : '/'
    });
});

//i18next
nmsDemo.config(function ($i18nextProvider) {
    $i18nextProvider.options = {
        lng: 'en',
        fallbackLng: 'en',
        resGetPath: 'locales/__lng__/__ns__.json'
    };
});

