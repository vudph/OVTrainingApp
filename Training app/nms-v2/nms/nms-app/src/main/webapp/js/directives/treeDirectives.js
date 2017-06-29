angular.module('nmsDemo.treeDirectives', ['jm.i18next']).directive('nmsTree', function($compile, deviceService, utilService) {
    return {
        restrict : 'E',
        scope : {
            model : '=',
            treeNode : '=',
            menuItemList : '='
        },
        template :
            '<div class="input-append"><input class="span2 search-query" type="text" name="nms-tree-search"  ng-i18next="[placeholder]search" /></div>\n' +
            '<div id="nms-tree-container"></div>',
        
        link : function(scope, element, attrs) {

            var treeContainer = element.children()[1];


            // search
            $("input[name=nms-tree-search]").keyup(function(e) {
                var match = $(this).val();
                $(treeContainer).dynatree("getRoot").visit(function(node) {
                    if (node.isVisible() && node.data.title) {
                        if ((node.data.title.toLowerCase()).indexOf(match.toLowerCase()) >= 0) {
                            node.visitParents(function(node) {
                                $(node.li).show();
                                return (node.parent != null);
                            }, true);
                        } else {
                            $(node.li).hide();
                        }
                    }
                });
            }).focus();
            //end search

			var focusNode = null;
			// scope.status = {offline: 'OFFLINE', active: 'ACTIVE'};
            $(treeContainer).dynatree({
                children : scope.model.data,
    
                //Clicking on a tree item will execute this callback
                onActivate : function(node) {
                    console.log("Select ", node);
                    scope.model.onSelect(node);
                },

                //This callback will be called if the node is set to lazy loading,and is expanded for the first time
                onLazyRead : function(node) {
                    console.log("Expand ", node);
                    scope.model.onExpand(node);
                    // scope.treeContextMenu(node);
                    console.log(scope.menuItemList);
                },
                onCreate : function(node){
                    scope.treeContextMenu(node);
                    console.log('oncreate node:'+ node.data.name);
                    scope.model.onDisable(node);
                },
                onFocus : function(node){
                    focusNode = node;
                    console.log('focus' + focusNode.data.title);
                    scope.model.onDisable(node);
                    // console.log('focus');                    
                    scope.$apply();
                },
                persist : true,
                activeVisible : true
            });

            //populate the tree node to controller
            scope.treeNode = $(treeContainer).dynatree('getTree');

			scope.treeContextMenu = function(node) {
				var attrObj = {'ng-context-menu':'', 'list-menu-items':'menuItemList'};
				utilService.setAttrForNode(node, attrObj);
				$compile($(node.li))(scope);
	           // scope.$digest();
            }
            // scope.setAttrForNode = function(node, attrObj)
            // {
				// var li = $(node.li);
				// li.attr(attrObj);				           	
            // }
            
            
			$(treeContainer).mouseup(function(e){
				if(e.button == 2){
					    // alert();
					  // alert(e.target.parentElement.textContent);// right mouse up
					var elem = e.target;
					// elem.focus();
					var elemli = $(elem).parent().parent();
					var elemlihtml = elemli.html();
					var mypath = [];
					  
					console.log("hey Begin.");
					var elemNode = null;
					$(treeContainer).dynatree("getRoot").visit(function(node){						
							if ($(node.li).html() === elemlihtml ){
								console.log("yes");
								scope.$parent.selectedNode = node;
								node.focus();							
							}					
					});
				
				}     
			}); 
            if (scope.model.data.length == 0) {
                var unregisterWatch = scope.$watch('model.data', function(newVal, oldVal) {
                    if (newVal !== undefined && newVal !== oldVal) {
                        console.log('loading tree', newVal);
                        var tree = $(treeContainer).dynatree("getTree");

                        tree.getRoot().addChild(newVal);
    
                        // select first child
                        var children = tree.getRoot().getChildren();
                        if (children != null) {
                            children[0].activate();
                        }
                        unregisterWatch();
                    }
                }, true);
            };
        }
    };
}); 