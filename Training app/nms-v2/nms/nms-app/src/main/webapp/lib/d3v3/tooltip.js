d3.tooltip = {};

    d3.tooltip = function(){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        var attrs = {};
        var text = '';
        var styles = {};

        function tooltip(selection){

            selection.on('mouseover.tooltip', function(pD, pI){
                 var sheet = document.createElement('style')
                sheet.innerHTML =
                 "#charttooltip h3 {margin: 0;padding: 4px 14px;line-height: 18px;font-weight: normal;background-color: rgba(247,247,247,0.75);text-align: center;border-bottom: 1px solid #ebebeb;-webkit-border-radius: 5px 5px 0 0;-moz-border-radius: 5px 5px 0 0;border-radius: 5px 5px 0 0; font-family: Arial;font-size: 13px;}"+
                 "#charttooltip {position: absolute;background-color: rgba(255,255,255,0.75);padding: 1px;border: 1px solid rgba(0,0,0,.2);z-index: 10000;font-family: Arial;font-size: 13px;-moz-box-shadow: 0 5px 10px rgba(0,0,0,.2); -webkit-box-shadow: 0 5px 10px rgba(0,0,0,.2);box-shadow: 0 5px 10px rgba(0,0,0,.2);-webkit-border-radius: 6px;"+
                                 "-moz-border-radius: 6px;border-radius: 6px;pointer-events: none;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}"+
                 "#charttooltip p {margin: 0;padding: 5px 14px;text-align: center;}"+
                 ".charttooltip span {display: inline-block;margin: 2px 0;}";

                 document.body.appendChild(sheet);

                var name, value;
                // Clean up lost tooltips
                d3.select('body').selectAll('div.tooltip').remove();
                d3.select('body').selectAll('#charttooltip').remove();
                // Append tooltip
                tooltipDiv = d3.select('body').append('div');
                tooltipDiv.attr("id", "charttooltip");
                tooltipDiv.attr(attrs);
                tooltipDiv.style(styles);
                var absoluteMousePos = d3.mouse(bodyNode);
                
                tooltipDiv.style("left", (absoluteMousePos[0] + 10)+'px')
                .style("top", (absoluteMousePos[1] - 15)+'px')
                .style("position", 'absolute')
                .style("z-index", '1001')
                ;
                // Add text using the accessor function, Crop text arbitrarily
                tooltipDiv.style('width', function(d, i){ return (text(pD, pI).length > 80) ? '300px' : null; })
                    .html(function(d, i){return text(pD, pI);});
            })
            .on('mousemove.tooltip', function(pD, pI){
                // Move tooltip
                var absoluteMousePos = d3.mouse(bodyNode);
                tooltipDiv.style({
                    left: (absoluteMousePos[0] + 10)+'px',
                    top: (absoluteMousePos[1] - 15)+'px'
                });
                // Keep updating the text, it could change according to position
                tooltipDiv.html(function(d, i){ return text(pD, pI); });
            })
            .on('click.tooltip', function(pD, pI){
                // Move tooltip
               tooltipDiv.remove();
            })
            .on('mouseout.tooltip', function(pD, pI){
                // Remove tooltip
                tooltipDiv.remove();
            });

        }

        tooltip.attr = function(_x){
            if (!arguments.length) return attrs;
            attrs = _x;
            return this;
        };

        tooltip.style = function(_x){
            if (!arguments.length) return styles;
            styles = _x;
            return this;
        };

        tooltip.text = function(_x){
            if (!arguments.length) return text;
            text = d3.functor(_x);
            return this;
        };

        return tooltip;
    };