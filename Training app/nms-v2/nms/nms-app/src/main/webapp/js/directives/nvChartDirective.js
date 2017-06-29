(function() {
    'use strict';

    angular.module('nvd3.directives', [])
        .directive('pieChart', function() {
            return {
                restrict: 'EA',
                template: '<svg></svg><div align="center"></div>',
                scope: {
                    chart: '='

                },
                link: function(scope, elm, attr) {
                    var childrenNode = elm.children()[0];
                    var childrenNode1 = elm.children()[1];
                    var xGroup = scope.chart.xGroup;
                    var unit = scope.chart.unit;
                      var width = scope.chart.options.width || 400;
                      var height = scope.chart.options.height || 400;
                      var myColors = scope.chart.options.color;
                      var title = scope.chart.options.title;
                      var titleFont = scope.chart.options.titleFont || "16px sans-serif";
                      var titleColor = scope.chart.options.titleColor || "black";
                      var showLabels = scope.chart.options.showLabels;
                      var pieLabelsOutside = scope.chart.options.pieLabelsOutside;
                  var  donut=scope.chart.options.donut;

                    var color = myColors ? d3.scale.ordinal().range(myColors) : d3.scale.category20();


                    var calPercent = function(dataSet) {
                        var total = 0;
                        for (var i = 0; i < dataSet.length; i++) {
                            total += dataSet[i][unit];
                        }

                        for (var i = 0; i < dataSet.length; i++) {
                            dataSet[i]['percent'] = Math.round(dataSet[i][unit] / total * 100);

                        }
                        return dataSet;
                    }

                    scope.$watch("chart", function(newVal, oldVal) {

                        if (newVal.data) {

                            var data = calPercent(newVal.data);

                            nv.addGraph(function() {
                                var chart = nv.models.pieChart()
                                    .x(function(d) {
                                        return d[xGroup]
                                    })
                                    .y(function(d) {
                                        return d[unit]
                                    })
                                    .showLabels(showLabels)
                                    .values(function(d) {
                                        return d
                                    })
                                    .color(color.range())
                                    .pieLabelsOutside(pieLabelsOutside)
                                    .donut(donut)
                                    .width(width)
                                    .height(height);

                                d3.select(childrenNode)
                                    .datum([data])
                                    .transition().duration(1200)
                                    .attr('width', width)
                                    .attr('height', height)
                                    .call(chart);

                                //custom tooltip    
                                var tp = function(key, y, e, graph) {
                                    return '<h3>' + key + '</h3>' +
                                        '<p>' + y + ' ( ' + e.point.percent + '% )</p>';
                                    //  '<p style="font-size:'+fontSize+'">' +  y + ' ( '+ e.point.percent+'% )</p>' ;

                                };
                                chart.tooltipContent(tp);
                                
                                //event stateChange
                                chart.dispatch.on('stateChange', function(e) { 
                                    newVal.onStateChange(e);
                                    });

                                //event onSelect
                                  d3.selectAll('.nv-slice').on('mousedown', function(e) {
                                         newVal.onSelect(e);
                                      });
                                   

                                return chart;
                            });

                        }
                    }, true);
                    //add title as text
                    d3.select(childrenNode1) 
                    .append("text")
                        .attr("x", 200)
                        .attr("y", 100)
                        .attr("text-anchor", "middle")
                        .style("color", titleColor)
                        .style("font", titleFont)
                        .text(title);

                }
            };
        })
        .directive('barChart', function() {
            return {
                restrict: 'EA',
                template: '<svg id="barChart"></svg><div id="barTitle" align="center"></div>',
                scope: {
                    chart: '='
                },
                link: function(scope, elm, attr) {
                var childrenNode = elm.children()[0];
                    var childrenNode1 = elm.children()[1];

                    var xGroup = scope.chart.xGroup;
                    var unit = scope.chart.unit;

                      var width = scope.chart.options.width || 400;
                      var height = scope.chart.options.height || 400;
                      var myColors = scope.chart.options.color;
                      var title = scope.chart.options.title;
                      var titleFont = scope.chart.options.titleFont || "16px sans-serif";
                      var titleColor = scope.chart.options.titleColor || "black";
                      var showValues = scope.chart.options.showValues;
                      var pieLabelsOutside = scope.chart.options.pieLabelsOutside;
                      var tooltips=scope.chart.options.tooltips;
                      var color = myColors ? d3.scale.ordinal().range(myColors) : d3.scale.category20();
                    scope.$watch('chart', function(newVal, oldVal) {
                        if (newVal.data) {
                           
                            d3.scale.myColors = function() {
                                return d3.scale.ordinal().range(myColors);
                            };
                            var data = [{
                                key: "",
                                values: newVal.data
                            }];
                            nv.addGraph(function() {
                                var chart = nv.models.discreteBarChart()
                                    .x(function(d) {
                                        return d[xGroup]
                                    })
                                    .y(function(d) {
                                        return d[unit]
                                    })
                                    .tooltips(tooltips)
                                    .showValues(showValues)
                                    .color(color.range())
                                    .width(width)
                                    .height(height);


                                d3.select(childrenNode)
                                    .datum(data)
                                    .transition().duration(500)
                                    .attr('width', width)
                                    .attr('height', height)
                                    .call(chart);

                                nv.utils.windowResize(chart.update);

                                return chart;
                            });

                        }
                    }, true); 
                    //add title as text
                    d3.select(childrenNode1) 
                    .append("text")
                        .attr("x", 200)
                        .attr("y", 100)
                        .attr("text-anchor", "middle")
                        .style("color", titleColor)
                        .style("font", titleFont)
                        .text(title);



                }
            };
        });

})();