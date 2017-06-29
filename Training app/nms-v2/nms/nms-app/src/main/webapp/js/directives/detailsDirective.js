angular.module('nmsDemo.detailsDirective', []).directive('nmsDetails', function($compile) {
    return {
        restrict : 'EA', //Element,
        scope : {
            model : '=',
        },
        
        link : function(scope, element, attrs) {

            scope.$watch('model', function(newVal, oldVal) {
                element.html("");
                if (newVal) {
                    for (var i = 0; i < newVal.length; ++i) {
                        var obj = newVal[i];
                        var fieldSet = $compile("<fieldset></fieldset>")(scope);
                        var groupName = $compile("<legend>{{'" + obj.groupName + "' | i18next }}</legend>")(scope);
                        fieldSet.append(groupName);
    
                        for (var j = 0; j < obj.attributes.length; ++j) {
                            var attribute = obj.attributes[j];
                            var attrEl = $compile('<p></p>')(scope);
                            attrEl.append($compile("<b>{{'" + attribute.name + "'| i18next }}:&nbsp;</b>")(scope));
    
                            if (attribute.writable) {
                                switch(attribute.dataType) {
                                    case 'String':
                                        var editor = $compile('<input type="text" ng-model="model' + '[' + i + '].attributes[' + j + '].value" />')(scope);
                                        attrEl.append(editor);
                                        break;
                                    case 'Number':
                                        var editor = $compile('<input type="number" ng-model="model' + '[' + i + '].attributes[' + j + '].value" />')(scope);
                                        attrEl.append(editor);
                                        break;
                                    case 'Enum':
                                        var editor = $compile('<select ng-model="model[' + i + '].attributes[' + j + '].value" ng-options="value for value in model[' + i + '].attributes[' + j + '].validValues"></select>')(scope);
                                        attrEl.append(editor);
                                        break;
                                }
                            } else {
                                attrEl.append(attribute.value);
                            }
    
                            fieldSet.append(attrEl);
                        }
                        element.append(fieldSet);
                    };
                }
            });
        }
    };
}); 