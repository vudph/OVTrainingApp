nmsDemo.directive('ngContextMenu', function($compile) {

    return {
        restrict : 'A',
        scope : {
            listMenuItems: '=',
            contextData : '='
        },
//        controller : function($scope){
//          console.log("context data of ng-context-menu : ",$scope.contextData);
//            $scope.$watch('contextData',function(newVal){
//                   console.log("new Val of context-data:",newVal);
//            },true);
//        },
        link : function(scope, element, attrs) {
            console.log("Context Menu");

            var menuTemplate = angular.element('<ul class="dropdown-menu angular-context-menu"></ul>');
            element.append(menuTemplate);

            console.log(scope.listMenuItems);
            var menu = element.find('ul');
            for(var i in scope.listMenuItems){
                var item = scope.listMenuItems[i];
                var strToAppend = '<li><a>'+ item.name + '</a></li><li class="divider"></li>';
                if(i == scope.listMenuItems.length - 1)
                    strToAppend = '<li><a>'+ item.name + '</a></li>';
                menu.append(strToAppend);
            }

            menu.hide();

            element.on('contextmenu', function(event) {
                var menuList = angular.element('.angular-context-menu');
                menuList.hide();
                menu.css({
                    position : "fixed",
                    display : "block",
                    left : event.clientX + 'px',
                    top : event.clientY + 'px',
                    cursor: 'pointer'
                });
                event.preventDefault();
                event.stopPropagation();
            });

            angular.element(document).on("mouseup", function(e) {
                //which === is the keycode of the mouse 'left click'
                if (e.which === 1) {
                    menu.css({
                        'display' : 'none'
                    });
                }

            });

            scope.$watch('menu',function(newVal,oldVal){
                var menuItems = menu.children();
                // console.log(menuItems.length);
                menuItems.filter(':not(.divider)').each(function(index){
                    $(this).on('click',function(){
                        scope.listMenuItems[index].handler(scope.contextData);
                    })
                });
            });
        }
    };
});
