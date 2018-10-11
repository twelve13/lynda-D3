var svg = d3.select("svg"),
	height = +svg.attr("height"),
	width = +svg.attr("width");

var palette = ["#1eb8de", "#47c4b6", "#ff8b94", "#e6e6e6", "#ade550"];
var color = d3.scaleOrdinal(palette);

//padding dictates spacing between circles
var pack = d3.pack()
	.size([height, width])
	.padding(2);

d3.csv("lynda-stats.csv", function(d) {
	d.count = +d.count;
	console.log(d);
	if (d.count) return d;
}, function(error, classes) {
	if (error) throw error;



	var root = d3.hierarchy({children: classes})
	.sum(function(d) { return d.count; })

	//create the nodes
	var node = svg.selectAll(".node")
		.data(pack(root).leaves())
		.enter().append("g")
			.attr("package", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

	//add the circles
	node.append("circle")
		.attr("id", function(d) { return d.data.name; })
		.attr("r", function(d) { return d.r; })
		.style("fill", function(d) { return color(d.data.category); });

	//add the text
	node.append("text")
		.selectAll("tspan")
		.data(function(d) { return d.data.name.split(/(?=[A-Z][^[A-Z])/g); })
		.enter().append("tspan")
			.attr("x", 0)
			.attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
			.text(function(d) { return d; });

	//add the popup boxes upon hover
	//format 'count' values so there commas per three digits
	var format = d3.format(",d");
	node.append("title")
		.text(function(d) {return "Course: " + d.data.name + "\n" + "\n" + "Description: " + d.data.description + "\n" + "\n" + "Views: " + format(d.data.count); });
});