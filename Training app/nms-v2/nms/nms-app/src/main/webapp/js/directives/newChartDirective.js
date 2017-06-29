angular.module('chart.chartDirective', [])
.directive('npieChart', function($compile) {

	return {
		restrict : 'EA',
		template : '<div></div><div align="center"></div>',
		scope : {
			chart : '='
		},

		// angular directives return a link fn
		link : function(scope, element, attrs) {
			//CSS
			var sheet = document.createElement('style')
			sheet.innerHTML = ".slice:hover  {opacity: .7;}";
			document.body.appendChild(sheet);

			var childrenNode = element.children()[0];
			var childrenNode1 = element.children()[1];
			var width = scope.chart.options.width || 400;
			var height = scope.chart.options.height || 400;
		    var donut = scope.chart.options.donut;
			var titleFont = scope.chart.options.titleFont || "16px sans-serif";
			var titleColor = scope.chart.options.titleColor || "black";
			var showLabels = scope.chart.options.showLabels;
			var labelsFont = scope.chart.options.labelsFont || "13px Arial";
			var labelsColor = scope.chart.options.labelsColor || "black";
			var name = scope.chart.name;
			var value = scope.chart.value;
            var myColors,color,data,dataPercent,pie,isFirstChart;
			//calculate percent
			var calPercent = function(dataSet) {
				var dataPercent=[];
				var total = 0;
				for (var i = 0; i < dataSet.length; i++) {
					total += dataSet[i][value];
				}

				for (var i = 0; i < dataSet.length; i++) {
					dataPercent[i] = (dataSet[i][value] / total * 100).toFixed(2);

				}

				return dataPercent;
			}

           scope.$watch('chart', function(newVal, oldVal) {
                myColors =newVal.options.color;
                color = myColors ? d3.scale.ordinal().range(myColors) : d3.scale.category20();
                title = newVal.options.title;
             if(newVal.data){
             	$(childrenNode).empty();
                $(childrenNode1).empty();
             	data = newVal.data;
             	dataPercent=calPercent(data);
             	if (!isFirstChart) {
             		pie = new pieChart();
             		isFirstChart=true;
             	}else{
             		pie = new pieChart();
             	};
              
             }
              
          	}, true);
            
			function pieChart() {
				var self = this;
				var outerRadius = Math.min(width, height) / 2.5,
				 	innerRadius = outerRadius * .999;
				 var innerRadiusFinal=0;
				// for animation
				if (donut==true) {
					innerRadiusFinal = outerRadius * .5;
				}
				
				var innerRadiusFinal3 = outerRadius * .55;
				var outerRadiusFinal3 = outerRadius * 1.05;
				var svg = d3.select(childrenNode).append("svg:svg").data([data]).attr("width", width).attr("height", height)

				var vis = svg.append("svg:g")//make a group to hold our pie chart
				             .attr("transform", "translate(" + width / 2 + "," + width / 2 + ")"); //move the center of the pie chart from 0, 0 to radius, radius
				

				var arc = d3.svg.arc()//this will create <path> elements for us using arc data
				            .outerRadius(outerRadius).innerRadius(innerRadius);

				// for animation
				var arcFinal = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadius);
				var arcFinal3 = d3.svg.arc().innerRadius(innerRadiusFinal).outerRadius(outerRadiusFinal3);
				
					
				var pie = d3.layout.pie()//this will create arc data for us given a list of values
							.value(function(d) {
								return d[value];
							})//we must tell it out to access the value of each element in our data array
							.sort(function(d) {
								return null;
							});

				var arcs = vis.selectAll("g.slice")//this selects all <g> elements with class slice (there aren't any yet)
							  .data(pie)//associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
							  .enter()//this will create <g> elements for every "extra" data element that should be associated with a selection. 
							  .append("svg:g")//create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
				              .attr("class", "slice")//allow us to style things in the slices (like text)
				              .on("mouseover", mouseover)
				              .on("mouseout", mouseout)
				              .on("click", click);

				if (!isFirstChart) {
					arcs.append("svg:path")
				    .attr("fill", function(d, i) {
						return color(i);
					})//set the color for each slice 
					.attr("d", arc)//this creates the actual SVG path using the associated data (pie) with the arc drawing function
					//.append("svg:title") //mouseover title showing the figures
					// .text(function(d) { return d.data[name] + ": " + d.data[value]; });
					
					//for animation
					svg.selectAll("g.slice")
					   .selectAll("path")
					   .transition().duration(750).delay(10)
					   .attr("d", arcFinal);
				}else{
					arcs.append("svg:path")
				    .attr("fill", function(d, i) {
						return color(i);
					})//set the color for each slice 
					.attr("d", arcFinal)//this creates the actual SVG path using the associated data (pie) with the arc drawing function
				}

					
				
				
				// Add a label to the larger arcs, translated to the arc centroid and rotated.
				
					arcs.filter(function(d) {
							return d.endAngle - d.startAngle > .2;
						})
						.append("svg:text").attr("dy", ".35em").attr("text-anchor", "middle").attr("transform", function(d) {
							return "translate(" + arcFinal.centroid(d) + ")rotate(" + angle(d) + ")";
						})
						.style("fill", labelsColor).style("font", labelsFont)
						.style("display", showLabels == false ? "none" : "inline").text(function(d,i) {
							return d.data[name] + ": " + dataPercent[i] + "%";
						});
	
					// Computes the label angle of an arc, converting from radians to degrees.
					function angle(d) {
						var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
						return a > 90 ? a - 180 : a;
					}
	
					// Pie chart title
					if (donut == true) {
						vis.append("svg:text")
						   .attr("dy", ".35em")
						   .attr("text-anchor", "middle")
						   .style("fill", titleColor)
						   .style("font", titleFont)
						   .attr("class", "title")
						   .text(title);
	
					} else {
						d3.select(childrenNode1).append("text")
						  .attr("x", (width / 2))
						  .attr("y", 0 - (width / 2))
						  .attr("text-anchor", "middle")
						  .style("color", titleColor)
						  .style("font", titleFont)
						  .text(title);
					}
				

				//mouseover event
				function mouseover() {
					d3.select(this).select("path").transition().duration(750)
					// .attr("stroke","red")
					// .attr("stroke-width", 1.5)
					.attr("d", arcFinal3);
				}

				//mouseout event
				function mouseout() {
					d3.select(this).select("path").transition().duration(750)
					//.attr("stroke","blue")
					//.attr("stroke-width", 1.5)
					.attr("d", arcFinal);
				}
				//click event
				function click(d) {
					scope.$apply(function() {
					 scope.chart.onSelect(d);
					});
										
				}

				//create legend
				var legend = d3.select(childrenNode)
							   .append("svg")
							   .attr("class", "legend")
							   .attr("width", outerRadius/2)
							   .attr("height", outerRadius * 2)
							   .selectAll("g")
							   .data(color.domain().slice().reverse())
							   .enter().append("g")
							   .attr("transform", function(d, i) {
									return "translate(0," + i * 20 + ")";
								});

				legend.append("rect")
				      .attr("width", 18)
				      .attr("height", 18)
				      .attr("fill", function(d, i) {
						 return color(i);
					   });

				legend.append("text")
					  .attr("x", 24)
					  .attr("y", 9)
					  .attr("dy", ".35em")
					  .text(function(d, i) {
						return data[i][name];
				      });

				//  tooltip
				arcs.call(d3.tooltip().style({
					color : 'black'
				}).text(function(d, i) {
					return '<h3>' + data[i][name] + '</h3>' +
					    '<p>' + data[i][value] + ' ( ' + dataPercent[i] + '% )</p>';

				}))
			}

			

		}
	};
})
.directive('nbarChart', function() {
	return {
		restrict : 'EA',
		template : '<div></div><div align="center"></div>',
		scope : {
			chart : '='
		},
		link : function(scope, element, attrs) {
			//css
			var sheet = document.createElement('style')
			sheet.innerHTML = "rect.barchart  {opacity: .75;} rect.barchart:hover  {opacity: 1;} .axis line{fill: none;stroke: #e5e5e5;shape-rendering: crispEdges;}";
			document.body.appendChild(sheet);

			var childrenNode = element.children()[0];
			var childrenNode1 = element.children()[1];
			
			var name = scope.chart.name;
			var value = scope.chart.value;
			var title = scope.chart.options.title;
			var width = scope.chart.options.width || 400;
			var height = scope.chart.options.height || 400;
			var titleFont = scope.chart.options.titleFont || "16px sans-serif";
			var titleColor = scope.chart.options.titleColor || "black";
			var showLabels = scope.chart.options.showLabels;
			var labelsFont = scope.chart.options.labelsFont || "13px Arial";
			var labelsColor = scope.chart.options.labelsColor || "black";
			var xLabel = scope.chart.options.xLabel;
			var yLabel = scope.chart.options.yLabel;
            var myColors,color;
			var margin = {
				top : 10,
				right : 75,
				bottom : 85,
				left : 85
			},
			    w = width - margin.left - margin.right,
			    h = height - margin.top - margin.bottom;
			var padding = 10;
			var data,bar,isFirstChart;	
			scope.$watch('chart', function(newVal, oldVal) {
                myColors =newVal.options.color;
                color = myColors ? d3.scale.ordinal().range(myColors) : d3.scale.category20();
                title = newVal.options.title;
				if (newVal.data) {
                    $(childrenNode).empty();
                    $(childrenNode1).empty();
					data = newVal.data;
					if (!isFirstChart) {
						bar=new barChart();
						isFirstChart=true;
					} else{
						bar=new barChart();
					};
					

				}
			}, true);
			
			function barChart(){
					var xScale = d3.scale.ordinal().domain(d3.range(data.length)).rangeRoundBands([0, w], 0.05);
					var yScale = d3.scale.linear().domain([0, d3.max(data, function(d) {
						return d[value];
					})]).range([h, 0]);
					var xAxis = d3.svg.axis().scale(xScale).tickSize(-h, 0).tickFormat(function(d) {
						return data[d][name];
					}).orient("bottom");
					var yAxis = d3.svg.axis()
								  .scale(yScale)
								  .orient("left")
								  .tickFormat(d3.format(',.1f'))
								  .ticks(5)
								  .tickSize(-w, 0); //line

					//SVG element
					var svg = d3.select(childrenNode)
								.append("svg")
								.attr("width", w + margin.left + margin.right)
								.attr("height", h + margin.top + margin.bottom)
								.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					// yAxis
					svg.append("g")
					   .attr("class", "y axis")
					   .attr("transform", "translate(0 ,0)")
					   .call(yAxis);
					// xAxis
					svg.append("g")// Add the X Axis
					   .attr("class", "x axis")
					   .attr("transform", "translate(0," + (h) + ")")
					   .call(xAxis).selectAll("text")
					   .style("text-anchor", "end")
					   .attr("dx", "-.8em")
					   .attr("dy", ".15em")
					   .attr("transform", function(d) {
							return "rotate(-25)";
						});
										 
					 var bars = svg.selectAll("rect.barchart")
								  .data(data)
								  .enter()
								  .append('g')
								  .attr("class", "bar")
								  .append("rect")
								  .attr("class", "barchart");
								  
					if (isFirstChart) {
								  bars.attr("width", xScale.rangeBand()).attr("y", function(d) {
									return yScale(d[value]);
									})
								 
								  .attr("x", 2 / xScale.rangeBand()).attr("height", function(d) {
									return h - yScale(d[value]);
									})
								  .attr("fill", function(d, i) {
									return color(i);
									})
								  .attr("transform", function(d, i) {
									return "translate(" + xScale(i) + ",0)";
									})
					} else{
							bars.transition().delay(function (d,i){ return i * 300;}).duration(300) // for animation
								  .attr("width", xScale.rangeBand()).attr("y", function(d) {
									return yScale(d[value]);
									})
								 
								  .attr("x", 2 / xScale.rangeBand()).attr("height", function(d) {
									return h - yScale(d[value]);
									})
								  .attr("fill", function(d, i) {
									return color(i);
									})
								  .attr("transform", function(d, i) {
									return "translate(" + xScale(i) + ",0)";
									})
					};
					// xAxis label
					svg.append("text")
					   .attr("transform", "translate(" + (w / 2) + " ," + (h + margin.bottom - 25) + ")")
					   .style("text-anchor", "middle")
					   .text(xLabel);

					//yAxis label
					svg.append("text")
					   .attr("transform", "rotate(-90)")
					   .attr("y", 0 - margin.left + 25)
					   .attr("x", 0 - (h / 2)).attr("dy", "1em")
					   .style("text-anchor", "middle")
					   .text(yLabel);
                    //  tooltip
                    bars.call(d3.tooltip().style({
                        color : 'black'
                    }).text(function(d, i) {
                            return '<h3>' + data[i][name] + '</h3>' +
                                '<p>' + data[i][value]+ '</p>';

                        }))
					//title
					d3.select(childrenNode1)
					  .append("text")
					  .attr("text-anchor", "middle")
					  .style("color", titleColor)
					  .style("font", titleFont)
					  .text(title);
					//event onSelect
					bars.on('mousedown', function(d) {
						//console.log(d);
						scope.$apply(function() {
						  scope.chart.onSelect(d);
						});
						
					});
			}

		}
	};
}).directive('gaugeChart', function() {
	return {
		restrict : 'EA',
		template : '<div></div><div align="center"></div>',
		scope : {
			chart : '='
		},
		link : function(scope, element, attrs) {

			var childrenNode = element.children()[0];
			var childrenNode1 = element.children()[1];
			var gauge;
			scope.$watch('chart', function(newVal, oldVal) {
				var size = newVal.options.size || 300;
				var title =newVal.options.title;
				var titleFont = newVal.options.titleFont || "16px sans-serif";
				var titleColor = newVal.options.titleColor || "black";
				var minorTicks = newVal.options.minorTicks || 5;
				var min=newVal.options.min;
				var max=newVal.options.max;;
				var name=newVal.name;
				var value=newVal.value;
				var options=newVal.options;
				
	
				function createGauge(name, label,min, max) {
					var config = {
						size : size,
						label : label,
						minorTicks : minorTicks,
						min: undefined != min ? min : 0,
						max: undefined != max ? max : 1000,
					}
					var range = config.max - config.min;
					config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
					config.redZones = [{ from: config.min + range*0.9, to: config.max }];
	
					gauge = new Gauge(name, config);
					gauge.render();
				}
				if(newVal){
						if (!value || max !==oldVal.options.max || name!==oldVal.name) {
		                    $(childrenNode).empty();
		                    createGauge(childrenNode,name,min,max);
		                    //title
		                    $(childrenNode1).empty();
		                    d3.select(childrenNode1)
		                        .append("text")
		                        .attr("text-anchor", "middle")
		                        .style("color", titleColor)
		                        .style("font", titleFont)
		                        .text(title);
		                }
		                if(value){
		                	gauge.redraw(value);
		                }
							
				}




            }, true);

		function Gauge(placeholderName, configuration)
		{
			this.placeholderName = placeholderName;
			
			var self = this; // for internal d3 functions
			
			this.configure = function(configuration)
			{
				this.config = configuration;
				
				this.config.size = this.config.size * 0.9;
				
				this.config.raduis = this.config.size * 0.97 / 2;
				this.config.cx = this.config.size / 2;
				this.config.cy = this.config.size / 2;
				
				this.config.min = undefined != configuration.min ? configuration.min : 0; 
				this.config.max = undefined != configuration.max ? configuration.max : 1000; 
				this.config.range = this.config.max - this.config.min;
				
				this.config.majorTicks = configuration.majorTicks || 5;
				this.config.minorTicks = configuration.minorTicks || 2;
				
				this.config.greenColor 	= configuration.greenColor || "#109618";
				this.config.yellowColor = configuration.yellowColor || "#FF9900";
				this.config.redColor 	= configuration.redColor || "#DC3912";
				
				this.config.transitionDuration = configuration.transitionDuration || 500;
			}
		
			this.render = function()
			{
				this.body = d3.select(this.placeholderName)
									.append("svg:svg")
									.attr("class", "gauge")
									.attr("width", this.config.size)
									.attr("height", this.config.size);
				
				this.body.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", this.config.raduis)
							.style("fill", "#ccc")
							.style("stroke", "#000")
							.style("stroke-width", "0.5px");
							
				this.body.append("svg:circle")
							.attr("cx", this.config.cx)
							.attr("cy", this.config.cy)
							.attr("r", 0.9 * this.config.raduis)
							.style("fill", "#fff")
							.style("stroke", "#e0e0e0")
							.style("stroke-width", "2px");
							
				for (var index in this.config.greenZones)
				{
					this.drawBand(this.config.greenZones[index].from, this.config.greenZones[index].to, self.config.greenColor);
				}
				
				for (var index in this.config.yellowZones)
				{
					this.drawBand(this.config.yellowZones[index].from, this.config.yellowZones[index].to, self.config.yellowColor);
				}
				
				for (var index in this.config.redZones)
				{
					this.drawBand(this.config.redZones[index].from, this.config.redZones[index].to, self.config.redColor);
				}
				
				if (undefined != this.config.label)
				{
					var fontSize = Math.round(this.config.size / 9);
					this.body.append("svg:text")
								.attr("x", this.config.cx)
								.attr("y", this.config.cy / 2 + fontSize / 2)
								.attr("dy", fontSize / 2)
								.attr("text-anchor", "middle")
								.text(this.config.label)
								.style("font-size", fontSize + "px")
								.style("fill", "#333")
								.style("stroke-width", "0px");
				}
				
				var fontSize = Math.round(this.config.size / 16);
				var majorDelta = this.config.range / (this.config.majorTicks - 1);
				for (var major = this.config.min; major <= this.config.max; major += majorDelta)
				{
					var minorDelta = majorDelta / this.config.minorTicks;
					for (var minor = major + minorDelta; minor < Math.min(major + majorDelta, this.config.max); minor += minorDelta)
					{
						var point1 = this.valueToPoint(minor, 0.75);
						var point2 = this.valueToPoint(minor, 0.85);
						
						this.body.append("svg:line")
									.attr("x1", point1.x)
									.attr("y1", point1.y)
									.attr("x2", point2.x)
									.attr("y2", point2.y)
									.style("stroke", "#666")
									.style("stroke-width", "1px");
					}
					
					var point1 = this.valueToPoint(major, 0.7);
					var point2 = this.valueToPoint(major, 0.85);	
					
					this.body.append("svg:line")
								.attr("x1", point1.x)
								.attr("y1", point1.y)
								.attr("x2", point2.x)
								.attr("y2", point2.y)
								.style("stroke", "#333")
								.style("stroke-width", "2px");
					
					if (major == this.config.min || major == this.config.max)
					{
						var point = this.valueToPoint(major, 0.63);
						
						this.body.append("svg:text")
						 			.attr("x", point.x)
						 			.attr("y", point.y)
						 			.attr("dy", fontSize / 3)
						 			.attr("text-anchor", major == this.config.min ? "start" : "end")
						 			.text(major)
						 			.style("font-size", fontSize + "px")
									.style("fill", "#333")
									.style("stroke-width", "0px");
					}
				}
				
				var pointerContainer = this.body.append("svg:g").attr("class", "pointerContainer");
				
				var midValue = (this.config.min + this.config.max) / 2;
				
				var pointerPath = this.buildPointerPath(midValue);
				
				var pointerLine = d3.svg.line()
											.x(function(d) { return d.x })
											.y(function(d) { return d.y })
											.interpolate("basis");
				
				pointerContainer.selectAll("path")
									.data([pointerPath])
									.enter()
									.append("svg:path")
									.attr("d", pointerLine)
									.style("fill", "#dc3912")
									.style("stroke", "#c63310")
									.style("fill-opacity", 0.7)
							
				pointerContainer.append("svg:circle")
									.attr("cx", this.config.cx)
									.attr("cy", this.config.cy)
									.attr("r", 0.12 * this.config.raduis)
									.style("fill", "#4684EE")
									.style("stroke", "#666")
									.style("opacity", 1);
				
				var fontSize = Math.round(this.config.size / 10);
				pointerContainer.selectAll("text")
									.data([midValue])
									.enter()
									.append("svg:text")
									.attr("x", this.config.cx)
									.attr("y", this.config.size - this.config.cy / 4 - fontSize)
									.attr("dy", fontSize / 2)
									.attr("text-anchor", "middle")
									.style("font-size", fontSize + "px")
									.style("fill", "#000")
									.style("stroke-width", "0px");
				
				this.redraw(this.config.min, 0);
			}
			
			this.buildPointerPath = function(value)
			{
				var delta = this.config.range / 13;
				
				var head = valueToPoint(value, 0.85);
				var head1 = valueToPoint(value - delta, 0.12);
				var head2 = valueToPoint(value + delta, 0.12);
				
				var tailValue = value - (this.config.range * (1/(270/360)) / 2);
				var tail = valueToPoint(tailValue, 0.28);
				var tail1 = valueToPoint(tailValue - delta, 0.12);
				var tail2 = valueToPoint(tailValue + delta, 0.12);
				
				return [head, head1, tail2, tail, tail1, head2, head];
				
				function valueToPoint(value, factor)
				{
					var point = self.valueToPoint(value, factor);
					point.x -= self.config.cx;
					point.y -= self.config.cy;
					return point;
				}
			}
			
			this.drawBand = function(start, end, color)
			{
				if (0 >= end - start) return;
				
				this.body.append("svg:path")
							.style("fill", color)
							.attr("d", d3.svg.arc()
								.startAngle(this.valueToRadians(start))
								.endAngle(this.valueToRadians(end))
								.innerRadius(0.65 * this.config.raduis)
								.outerRadius(0.85 * this.config.raduis))
							.attr("transform", function() { return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(270)" });
			}
			
			this.redraw = function(value, transitionDuration)
			{
				var pointerContainer = this.body.select(".pointerContainer");
				
				pointerContainer.selectAll("text").text(Math.round(value));
				
				var pointer = pointerContainer.selectAll("path");
				pointer.transition()
							.duration(undefined != transitionDuration ? transitionDuration : this.config.transitionDuration)
							//.delay(0)
							//.ease("linear")
							//.attr("transform", function(d) 
							.attrTween("transform", function()
							{
								var pointerValue = value;
								if (value > self.config.max) pointerValue = self.config.max + 0.02*self.config.range;
								else if (value < self.config.min) pointerValue = self.config.min - 0.02*self.config.range;
								var targetRotation = (self.valueToDegrees(pointerValue) - 90);
								var currentRotation = self._currentRotation || targetRotation;
								self._currentRotation = targetRotation;
								
								return function(step) 
								{
									var rotation = currentRotation + (targetRotation-currentRotation)*step;
									return "translate(" + self.config.cx + ", " + self.config.cy + ") rotate(" + rotation + ")"; 
								}
							});
			}
			
			this.valueToDegrees = function(value)
			{
				// thanks @closealert
				//return value / this.config.range * 270 - 45;
				return value / this.config.range * 270 - (this.config.min / this.config.range * 270 + 45);
			}
			
			this.valueToRadians = function(value)
			{
				return this.valueToDegrees(value) * Math.PI / 180;
			}
			
			this.valueToPoint = function(value, factor)
			{
				return { 	x: this.config.cx - this.config.raduis * factor * Math.cos(this.valueToRadians(value)),
							y: this.config.cy - this.config.raduis * factor * Math.sin(this.valueToRadians(value)) 		};
			}
			
			// initialization
			this.configure(configuration);	
		}

		}
	};
});