"use strict";
/*
 ngTable: Table + Angular JS

 @author Vitalii Savchuk <esvit666@gmail.com>
 @copyright 2013 Vitalii Savchuk <esvit666@gmail.com>
 @version 0.2.1
 @url https://github.com/esvit/ng-table/
 @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

angular.module("ngTable", []).directive("ngTable", ["$compile", "$q", "$parse", "$http", "ngTableParams",
function($compile, $q, $parse, $http, ngTableParams) {
	return {
		restrict : "A",
		//This directive has higher priority than ng-Repeat directive(1000),so its compile function will be executed before ng-Repeat compile function
		PRIORITY : 1001,
		scope : {
			tableData : '=',
			rowClassCalculator : '&',
			onHoverClass : '=',
			onMouseOutClass : '=',
			rowFields : '=',
			menuItemList : '=',
			tableFilter : '='
		},
        template : '<tr ng-repeat="row in tableData" ng-class="$parent.rowClassCalculator({rowObj : $parent.row})" ng-click=\'$parent.clickHandler($event,$parent.row,$parent.$index)\' ng-context-menu list-menu-items="$parent.menuItemList" context-data="$parent.currentRow" ng-mouseover="$parent.mouseOverHandler($parent.row)"><td ng-repeat="field in $parent.$parent.rowFields">{{$parent.$parent.row[field]}}</td></tr>',
		controller : ["$scope", "$timeout", '$element', '$parse',
		function($scope, $timeout, $element, $parse) {
			$scope.columns = [];
			var updateParams;

			$scope.sortingParams = $scope.$parent.tableParams.sorting;
			angular.forEach($scope.$parent.columnsData, function(item) {
				var el = item, i = 0, parsedTitle;

				if (el.ignoreCell && "true" === el.ignoreCell) {
					return;
				}
				parsedTitle = $parse(el.title)() || el.title;
				return $scope.columns.push({
					id : i++,
					title : parsedTitle,
					sortable : (el.sortable ? el.sortable : false),
					filter : (el.filter ? $parse(el.filter)() : false),
					filterData : (el.filterData ? el.filterData : null),
					show : (el.ngShow ? function(scope) {
						return $parse(el.ngShow)(scope);
					} : function() {
						return true;
					})
				});
			});

			$scope.params = $scope.params || {
				page : 1,
				count : 10
			};

			$scope.$watch('params.filter', (function(value) {
				if ($scope.params.$liveFiltering) {
					updateParams(value);
					return $scope.goToPage(1);
				}
			}), true);

			updateParams = function(newParams) {
				newParams = angular.extend($scope.params, newParams);
				//Assign new value for $scope.$parent.tableParams,which will then trigger watchers.
				$scope.paramsModel.assign($scope.$parent, new ngTableParams(newParams));
				return $scope.params = angular.copy(newParams);
			};

			$scope.goToPage = function(page) {
				if (page > 0 && $scope.params.page !== page && $scope.params.count * (page - 1) <= $scope.params.total) {
					return updateParams({
						page : page
					});
				}
			};

			$scope.changeCount = function(count) {
				return updateParams({
					page : 1,
					count : count
				});
			};

			$scope.doFilter = function() {
				return updateParams({
					page : 1
				});
			};

			$scope.selectedRowData = [];
			var selectetRowIndexes = [];


			$scope.clickHandler = function($event, row, $index) {
				if (!$event.ctrlKey) {
					$scope.selectedRowData = [];
					selectetRowIndexes = [];
				}
				if (selectetRowIndexes.indexOf($index) === -1) {
					selectetRowIndexes.push($index);
					$scope.selectedRowData.push(row);

				}

                var selectedRow = $element.find("tbody").children()[$index];
//                angular.element(selectedRow).css('border-color','red');
				console.log("You have select " + $scope.selectedRowData.length + "rows");
				console.log($scope.selectedRowData);
			}

			$element.on('mouseover', 'tr', function() {
				$(this).switchClass($scope.onMouseOutClass, $scope.onHoverClass, 0);
			});

			$scope.mouseOverHandler = function(row) {
				$scope.currentRow = row;
			};

			$element.on('mouseout', 'tr', function() {

				$(this).switchClass($scope.onHoverClass, $scope.onMouseOutClass, 0);
			});

			//This is the return value of the controller constructor function
			$scope.sortBy = function($event, column) {
				if (!$event.shiftKey) {
					$scope.sortingParams = {};
				}
				var sorting, sortingParams;
				if (!column.sortable) {
					return;
				}
				sorting = $scope.params.sorting && $scope.params.sorting[column.sortable] && ($scope.params.sorting[column.sortable] === "desc");

				$scope.sortingParams[column.sortable] = ( sorting ? "asc" : "desc");
				return updateParams({
					sorting : $scope.sortingParams
				});
			};
		}],
		//End of controller constructor function

		compile : function(element, attrs) {

			return function(scope, element, attrs) {
				var generatePages, headerTemplate, paginationTemplate;
				// scope.columns = columns;

				generatePages = function(currentPage, totalItems, pageSize) {
					var maxBlocks, maxPage, maxPivotPages, minPage, numPages, pages;
					maxBlocks = 11;
					pages = [];
					numPages = Math.ceil(totalItems / pageSize);
					if (numPages > 1) {
						pages.push({
							type : "prev",
							number : Math.max(1, currentPage - 1),
							active : currentPage > 1
						});
						pages.push({
							type : "first",
							number : 1,
							active : currentPage > 1
						});
						maxPivotPages = Math.round((maxBlocks - 5) / 2);
						minPage = Math.max(2, currentPage - maxPivotPages);
						maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
						minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));
						var i = minPage;
						while (i <= maxPage) {
							if ((i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1)) {
								pages.push({
									type : "more"
								});
							} else {
								pages.push({
									type : "page",
									number : i,
									active : currentPage !== i
								});
							}
							i++;
						}
						pages.push({
							type : "last",
							number : numPages,
							active : currentPage !== numPages
						});
						pages.push({
							type : "next",
							number : Math.min(numPages, currentPage + 1),
							active : currentPage < numPages
						});
					}
					return pages;
				};

				scope.$parent.$watch(attrs.ngTable, (function(params, oldVal) {
					if (angular.isUndefined(params)) {
						return;
					}
					//Returned function of the $parse(tableParams)
					scope.paramsModel = $parse(attrs.ngTable);
					scope.pages = generatePages(params.page, params.total, params.count);
					return scope.params = angular.copy(params);
				}), true);

				if (attrs.showFilter) {
					scope.$parent.$watch(attrs.showFilter, function(value) {
						return scope.show_filter = value;
					});
				}

				angular.forEach(scope.columns, function(column) {
					var promise;
					if (!column.filterData) {
						return;
					}
					promise = $parse(column.filterData)(scope, {
						$column : column
					});
					if (!(angular.isObject(promise) && angular.isFunction(promise.then))) {
						throw new Error("Function " + column.filterData + " must be promise");
					}
					delete column["filterData"];
					return promise.then(function(data) {
						if (!angular.isArray(data)) {
							data = [];
						}
						data.unshift({
							title : "-",
							id : ""
						});
						return column.data = data;
					});
				});

				if (!element.hasClass("ng-table")) {
					scope.templates = {
						header : (attrs.templateHeader ? attrs.templateHeader : "ng-table/header.html"),
						pagination : (attrs.templatePagination ? attrs.templatePagination : "ng-table/pager.html"),
						filterInput : (attrs.templateFilter ? attrs.templateFilter : "ng-table/filters/search.html")
					};

					headerTemplate = $compile("<thead ng-include=\"templates.header\"></thead>")(scope);
					paginationTemplate = $compile("<div ng-include=\"templates.pagination\"></div>")(scope);
					element.filter("thead").remove();
					element.prepend(headerTemplate).addClass("ng-table");
					return element.after(paginationTemplate);
				}
			};
		}
	};
}]);
//End of ng-table directive declaration

/*
 //@ sourceMappingURL=directive.js.map
 */
var __hasProp = {}.hasOwnProperty;

//Register a service factory that creates instances for service "ngTableParams" with the Injector,this code will be executed before the compiler starts processing directives
angular.module("ngTable").factory("ngTableParams", function() {
	var isNumber, ngTableParams;
	isNumber = function(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	};
	ngTableParams = function(data) {
		var ignoreFields, key, lastKey, name, params, v, value, _i, _len, _ref;
		ignoreFields = ["total", "counts"];
		this.page = 1;
		this.count = 1;
		this.counts = [10, 25, 50, 100];
		this.filter = {};
		this.sorting = {};
		for (key in data) {
			value = data[key];
			if (key.indexOf("[") >= 0) {
				params = key.split(/\[(.*)\]/);
				lastKey = "";
				_ref = params.reverse();
				for ( _i = 0, _len = _ref.length; _i < _len; _i++) {
					name = _ref[_i];
					if (name !== "") {
						v = value;
						value = {};
						value[ lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
					}
				}
				if (lastKey === 'sorting') {
					this[lastKey] = {};
				}
				this[lastKey] = angular.extend(this[lastKey] || {}, value[lastKey]);
			} else {
				this[key] = (isNumber(data[key]) ? parseFloat(data[key]) : data[key]);
			}
		}
		this.orderBy = function() {
			var column, direction, sorting, _ref1;
			sorting = [];
			_ref1 = this.sorting;
			for (column in _ref1) {
				if (!__hasProp.call(_ref1, column))
					continue;
				//direction =='asc'
				direction = _ref1[column];
				sorting.push((direction === "asc" ? "+" : "-") + column);
			}

			// return test;
			return sorting;
		};
		this.url = function(asString) {
			var item, pairs, pname, subkey;
			asString = asString || false;
			pairs = ( asString ? [] : {});
			for (key in this) {
				if (this.hasOwnProperty(key)) {
					if (ignoreFields.indexOf(key) >= 0) {
						continue;
					}
					item = this[key];
					name = encodeURIComponent(key);
					if ( typeof item === "object") {
						for (subkey in item) {
							if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
								pname = name + "[" + encodeURIComponent(subkey) + "]";
								if (asString) {
									pairs.push(pname + "=" + encodeURIComponent(item[subkey]));
								} else {
									pairs[pname] = encodeURIComponent(item[subkey]);
								}
							}
						}
					} else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
						if (asString) {
							pairs.push(name + "=" + encodeURIComponent(item));
						} else {
							pairs[name] = encodeURIComponent(item);
						}
					}
				}
			}
			return pairs;
		};
		return this;
	};
	return ngTableParams;
});

/*
//@ sourceMappingURL=params.js.map
*/

//This 'run block' will be executed after all services have been configured and the injector has beeen created
angular.module('ngTable').run(['$templateCache',
function($templateCache) {
	$templateCache.put('ng-table/filters/button.html', '<button ng-click="doFilter()" ng-show="filter==\'button\'" class="btn btn-primary btn-block">Filter</button>');
	$templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter[name]" ng-show="filter==\'select\'" class="filter filter-select"></select>')
	$templateCache.put('ng-table/filters/text.html', '<input type="text" ng-model="params.filter[name]" ng-show="filter==\'text\'" class="input-filter"/>');
	// $templateCache.put('ng-table/header.html', '<tr><th ng-class="{sortable: column.sortable,\'sort-asc\': params.sorting[column.sortable]==\'asc\', \'sort-desc\': params.sorting[column.sortable]==\'desc\'}" ng-click="sortBy($event,column)" ng-repeat="column in columns" ng-show="column.show(this)" class="header"><div>{{column.title}}</div></th></tr><tr ng-show="show_filter"><th ng-repeat="column in columns" ng-show="column.show(this)" class="filter"><form ng-submit="doFilter()"><input type="submit" style="position: absolute; left: -9999px; width: 1px; height: 1px;"/><div ng-repeat="(name, filter) in column.filter"><div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div></div></form></th></tr>');
	$templateCache.put('ng-table/header.html', '<tr><th ng-class="{sortable: column.sortable,\'sort-asc\': params.sorting[column.sortable]==\'asc\', \'sort-desc\': params.sorting[column.sortable]==\'desc\'}" ng-click="sortBy($event,column)" ng-repeat="column in columns" ng-show="column.show(this)" class="header"><div>{{column.title}}</div></th></tr><tr ng-show="show_filter"><th ng-repeat="key in rowFields" class="filter"><input type="text" ng-model="tableFilter[key]" class="input-filter"></th></tr>');
    $templateCache.put('ng-table/pager.html', '<div><ul class="pagination ng-cloak"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"><button ng-switch-when="prev" ng-click="goToPage(page.number)"  class="btn btn-mini">«</button><button ng-switch-when="first" ng-click="goToPage(page.number)" class="btn btn-mini" ng-class="{\'active\':params.page==page.number}">{{page.number}}</button><button ng-switch-when="page" ng-click="goToPage(page.number)" class="btn btn-mini" ng-class="{\'active\':params.page==page.number}">{{page.number}}</button><button ng-switch-when="more" ng-click="goToPage(page.number)"  class="btn btn-mini">…</button><button ng-switch-when="last" ng-click="goToPage(page.number)"  class="btn btn-mini" ng-class="{\'active\':params.page==page.number}">{{page.number}}</button><button ng-switch-when="next" ng-click="goToPage(page.number)"  class="btn btn-mini">»</button></li></ul><div ng-show="params.counts.length" class="btn-group pull-right"><button ng-repeat="count in params.counts" type="button" ng-class="{\'active\':params.count==count}" ng-click="changeCount(count)" class="btn btn-mini">{{count}}</button></div></div>');
//	$templateCache.put('ng-table/pager.html', '<div><ul class="pagination ng-cloak"><li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"><a ng-switch-when="prev" ng-click="goToPage(page.number)" href="" class="btn btn-mini">«</a><a ng-switch-when="first" ng-click="goToPage(page.number)" href="" class="btn btn-mini" ng-class="{\'active\':params.page==page}">{{page.number}}</a><a ng-switch-when="page" ng-click="goToPage(page.number)" href="" class="btn btn-mini">{{page.number}}</a><a ng-switch-when="more" ng-click="goToPage(page.number)" href="" class="btn btn-mini">…</a><a ng-switch-when="last" ng-click="goToPage(page.number)" href="" class="btn btn-mini">{{page.number}}</a><a ng-switch-when="next" ng-click="goToPage(page.number)" href="" class="btn btn-mini">»</a></li></ul><div ng-show="params.counts.length" class="btn-group pull-right"><button ng-repeat="count in params.counts" type="button" ng-class="{\'active\':params.count==count}" ng-click="changeCount(count)" class="btn btn-mini">{{count}}</button></div></div>');
}]);
