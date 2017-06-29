angular.module('nmsDemo.dashboardDirective', []).directive('ngDashboard', function($compile) {
    return {
        restrict : 'E',
        scope : {
            model : '='
        },
        template : '</div><ul id="myDashboard"></ul>',
        link : function(scope, element, attrs) {
            var children = element.children()[0];
            var data=scope.model.data;
            angular.element(children).sDashboard({
                dashboardData : data
            });


        }
    };
}); 