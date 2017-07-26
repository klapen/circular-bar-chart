    // Helper functions
var utils = {
    translation: function(x, y) {
        return 'translate(' + x + ',' + y + ')';
    },
    parentWidth: function(elem) {
        return elem.parentElement.clientWidth;
    },
    widthCalc: function(id) {
        return this.parentWidth(document.getElementById(id))
    },
    parentHeight: function(elem) {
        return elem.parentElement.clientHeight;
    },
    heightCalc: function(id) {
        return this.parentHeight(document.getElementById(id));
    }
}
    
var circularBarChart = {
    generate: function(id,data){
	var width = 500;
	var height = 500;
	var margin = {top:10,right:10,bottom:10,left:10};
	var innerWidth = width - margin.right - margin.left;
	var innerHeight = height - margin.top -margin.left;
	var radius = innerWidth/2;
	var graph = {
	    id: id,
	    width: width,
	    height: height,
	    margin: margin,
	    innerWidth: innerWidth,
	    innerHeight: innerHeight,
	    radius: radius,
	    innerRadius: radius*0.5, // Change to accomodate inner circle, 
	    numberFormat: d3.format('.2%'),
	    yScale: d3.scale.ordinal(),
	    angleScale: d3.scale.linear().range([0,2*Math.PI]),
	    colorScale: d3.scale.category10(),
	    arc: d3.svg.arc(),
	    loadData: function(data){
		this.data = data;
	    },
	    updateData: function(data){
		var that = this;
		that.loadData(data);
		// Animate changes
		var bars = that.chart.selectAll('g');
		bars.data(data);
		bars.transition().duration(750)
		    .attr('opacity',0)
		    .each('end',function(){
			var barUpdate = d3.transition(bars);
			barUpdate.select('path')
			    .attr('fill',function(d){return d.color})
			    .attr('d',function(d,i){return that.arcFunc(d,i,that)});
			barUpdate.select('text')
			    .text(function(d){return that.numberFormat(d.value)});
			bars.transition().duration(750).attr('opacity',1)
		    })
	    },
	    arcFunc:function(d,i,graph){
		var arc = graph.arc
		    .outerRadius(graph.radius-(i*graph.yScale.rangeBand()))
		    .innerRadius(graph.radius-((i+1)*graph.yScale.rangeBand()))
		    .startAngle(0).endAngle(graph.angleScale(d['value']));
		return arc();
	    },
	    render: function(data){
		var that = this;
		that.loadData(data);
		
		that.svg = d3.select('#'+id).append('svg')
		    .attr('width',that.width)
		    .attr('height',that.height);
		that.container = that.svg.append('g')
		    .attr('transform',utils.translation(that.margin.left,that.margin.top));
		that.chart = that.container.append('g')
		    .attr('transform',utils.translation(that.innerWidth/2,that.innerHeight/2));
		that.legend = that.container.append('g').attr('class','chart-legend');

		that.yScale.rangeBands([that.radius,that.innerRadius]);
		that.yScale.domain(that.data.map(function(d){return d['name']}));
		that.angleScale.domain([0,1]); // ToDo: define how to calculate max

		var bars = that.chart.selectAll('g')
		    .data(that.data).enter().append('g')
		    .attr('opacity',1);
		bars.append('path')
		    .attr('fill',function(d){return d.color})
		    .attr('d',function(d,i){return that.arcFunc(d,i,that)})
		bars.append('text')
		    .attr('y',function(d,i){
			var band = that.yScale.rangeBand();
			return 0-(that.radius-(i*band)-(band/2))
		    })
		    .attr('x',-50)
		    .style('dominant-baseline','middle')
		    .text(function(d){return that.numberFormat(d.value)})
	    },
	}
	graph.render(data);
	return graph
    }
}
var oas;
var blah = [
    [{'name':'opc1','value':0.2500,'color':'#6e0d25'},
     {'name':'opc2','value':0.5000,'color':'#c33149'},
     {'name':'opc3','value':0.7500,'color':'#a44a3f'}],
    [{'name':'opc1','value':0.3056,'color':'#3423a6'},
     {'name':'opc2','value':0.4258,'color':'#2a1e5c'},
     {'name':'opc3','value':0.1540,'color':'#7180b9'}],
    [{'name':'opc1','value':0.8950,'color':'#32021f'},
     {'name':'opc2','value':0.9056,'color':'#893168'},
     {'name':'opc3','value':0.6523,'color':'#4a1942'}],
];
document.addEventListener('DOMContentLoaded', function(event) {
    oas = circularBarChart.generate('chart',
				    [{'name':'opc1','value':0.6434,'color':'#a9fdac'},
				     {'name':'opc2','value':0.7589,'color':'#44cf6c'},
				     {'name':'opc3','value':0.4256,'color':'#32a287'}])
})
