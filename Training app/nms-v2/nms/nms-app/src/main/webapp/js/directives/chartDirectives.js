angular.module('nmsDemo.chartDirectives', [])
    .directive('ngPiechart', function () {
        var linkFunction = function (scope, element, attrs) {
            var parentNode = (element.parent())[0];
            var w = 400, //width
                h = 300, //height
                r = 100, //radius
                color = d3.scale.category20c(); //builtin range of colors

            scope.$watch('model', function (newVal, oldVal) {
                var xGroup = newVal.xGroup;
                var data = newVal.data;
                var url = newVal.url;
                var unit = newVal.unit;
                var anchor;

                $(parentNode).empty();

                if (data) {

                    anchor = d3.select(parentNode).append("a");

                    var svg = anchor.append("svg:svg")
                        .data([ data ])
                        .attr("width", w)
                        .attr("height", h);

                    //Create chart group
                    var chart = svg.append("svg:g")
                        .attr("transform", "translate(" + w / 2 + "," + 170 + ")")

                    //this is Path Generator Function,which will create <path> elements using arc data
                    var arc = d3.svg.arc()
                        .outerRadius(r);

                    //this will create arc data,which will be used later by arc function
                    var pie = d3.layout.pie()
                        .value(function (d) {
                            return d[unit];
                        }); //we must tell it how to access the value of each element in our data array

                    var arcs = chart.selectAll("g.slice")
                        .data(pie)
                        .enter()
                        .append("svg:g")
                        .attr("class", "slice");

                    arcs.append("svg:path").attr("fill", function (d, i) {
                        return color(i);
                    })
                        .attr("d", arc);


                    arcs.append("svg:text") //add a label to each slice
                        .attr("transform",function (d) { //set the label's origin to the center of the arc
                            //we have to make sure to set these before calling arc.centroid
                            d.innerRadius = 0;
                            d.outerRadius = r;
                            return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
                        }).attr("text-anchor", "middle") //center the text on it's origin
                        .text(function (d, i) {
                            return data[i][unit] + "%";
                        }); //get the label from our original data array


                    //Create legend group
                    var legend = svg.selectAll(".legend").data(
                            pie).enter().append("g")
                        .attr("class", "legend").attr("transform",
                        function (d, i) {
                            return "translate(-70," + i * 20 + ")";
                        });

//				Create legend bars
                    legend.append("rect").attr("x", w - 18).attr("width",
                            18).attr("height", 18).attr("fill", function (d, i) {
                            return color(i);
                        });

                    legend.append("text").attr("x", w - 24).attr("y", 9)
                        .attr("dy", ".35em").style("text-anchor", "end")
                        .text(function (d) {
                            return d.data[xGroup];
                        });

                    anchor.attr("href", url);
                }


            }, true);

        }

        return {
            restrict: 'EA',
            scope: {
                model: '='
            },
            link: linkFunction
        }
    })
    .directive('ngBarchart', function () {
        var linkFunction = function (scope, element, attrs) {
            var parentNode = (element.parent())[0];
            var margin = {
                    top: 60,
                    right: 50,
                    bottom: 30,
                    left: 40
                }
                , width = 300 - margin.left - margin.right
                , height = 300 - margin.top - margin.bottom;

            //This scale function will create evenly-space bands
            var x0 = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
            //Define ordinal scale function for x-axis
            var x1 = d3.scale.ordinal();
            //Define linear scale function for y-axis
            var y = d3.scale.linear().range([ height, 0 ]);

            var color = d3.scale.ordinal().range(
                [ "#98abc5", "#8a89a6", "#7b6888", "#6b486b",
                    "#a05d56", "#d0743c", "#ff8c00" ]);

            //Define x-Axis on the bottom
            var xAxis = d3.svg.axis().scale(x0).orient("bottom");

            //Define y-Axis on the left
            var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(
                d3.format(".2s"));



            scope.$watch('model', function (newVal, oldVal) {
                $(parentNode).empty();
                var data = newVal.data;
                var xGroup = newVal.xGroup;
                var url = newVal.url;

                if (data) {
                    var fields = d3.keys(data[0]).filter(function (key) {
                        return key !== xGroup;
                    });

                    var stats = [];

                    data.forEach(function (d) {
                        var types = fields.map(function (val) {
                            return {
                                name: val,
                                value: d[val]
                            };
                        });
                        stats.push(types);
                    });

                    //Create an <a> to wrap the whole <svg> element and its children
                    var anchor = d3.select(parentNode).append("a");

                    //Create svg element
                    var svg = anchor.append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom);

                    //Create a group element to wrap the whole chart,including axes and bars
                    var chart = svg.append("g").attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                    x0.domain(data.map(function (d) {
                        return d[xGroup];
                    }));
                    //set input domain for the x-Axis scale function
                    x1.domain(fields).rangeRoundBands([ 0, x0.rangeBand() ]);
                    //set input domain for the y-Axis scale function
                    y.domain([ 0, d3.max(data, function (d, i) {
                        return d3.max(stats[i], function (d) {
                            return d.value;
                        });
                    }) ]);

                    chart.append("g").attr("class", "x axis").attr("transform",
                        "translate(0," + height + ")").call(xAxis);

                    //Create the y-axis
                    chart.append("g").attr("class", "y axis").call(yAxis);

                    //Create a group to hold all the bars inside the svg element
                    var barGroup = chart.selectAll(".day").data(data).enter()
                        .append("g")
                        .attr("class", "g")
                        .attr("transform",
                        function (d) {
                            return "translate(" + x0(d[xGroup]) + ",0)";
                        });

                    barGroup.selectAll("rect").data(function (d, i) {
                        return stats[i];
                    }).enter().append("rect").attr("width", x1.rangeBand())
                        .attr("x",function (d) {
                            return x1(d.name);
                        }).attr("y",function (d) {
                            return y(d.value);
                        }).attr("height",function (d) {
                            return height - y(d.value);
                        }).style("fill", function (d) {
                            return color(d.name);
                        });


                    anchor.attr("href", url);
                }

            }, true);

        }

        return {
            restrict: 'EA',
            scope: {
                model: '='
            },
            link: linkFunction
        }
    })
;
