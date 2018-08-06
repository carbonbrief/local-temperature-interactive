var margin = {top: 10, right: 15, bottom: 30, left: 45},
    // calculate the width of the chart from the width of the line-wrapper
    width = parseInt(d3.select("#graph1").style("width")) - margin.left - margin.right,
    height = 220 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");
// var parseDate2 = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// define the line
var line = d3.line()
    .defined(function(d) { return d.anomaly != 0; }) // remove values with exactly 0, since these are the nulls
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.anomaly); });

var zeroLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(0); });

// var color = d3.scaleOrdinal()
//     // thinking it might be nice to do a different colour for an average
//     .domain(["Africa and Middle East", "China", "EU28", "Former USSR", "India", "Latin America", "Non-EU Europe", "Other",  "Other Asia", "United States"])
//     .range(["#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e"]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(".2f");

var svg = d3.select("#graph1").append("svg")
    .attr("id", "svg-1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var svg2 = d3.select("#graph2").append("svg")
//     .attr("id", "svg-2")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(",.2f");

var csv = "../data/charts/gridcell_" + 89.5 + "_" + 150.5 + ".csv";

function drawChart(){
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        data.filter(function(k){
            return !isNaN
        })

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.anomaly = +d.obs_anoms; // this is the bit that turns blanks to 0
        });

        x.domain([parseDate(1850), parseDate(2020)]);
        y.domain(d3.extent(data, function(d) { return d.anomaly; }));

        // Add the line at zero.
        svg.append("path")
        .data([data])
        .attr("class", "zero-line")
        .attr("d", zeroLine);

        // Add the valueline path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

        // Add the X Axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        // Add hover circles

        circles = svg.append("g")
        .attr("class", "hover-circles");
        
        circles.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .filter(function(d) { return d.anomaly != 0 })
        .attr("r", 3)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.anomaly); })
        // in order to have a the circle to be the same color as the line, you need to access the data of the parentNode
        .attr("fill", "white")
        .attr("opacity", 0)
        .on("mouseover", function(d) {
            //show circle
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.5)
            .attr("r", 4);
            // show tooltip
            div.transition()
            .duration(100)
            .style("opacity", .9);
            div.html("<p><span class='label-title'>Year: </span>" + yearFormat(d.year) + 
            "</p><p><span class='label-title'>Anomaly: </span>" + decimalFormat(d.anomaly) + 
            "C</p>")
            .style("left", (d3.event.pageX - 55) + "px")
            .style("top", (d3.event.pageY - 70) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("r", 3);
            // hide tooltip
            div.transition()
            .duration(200)
            .style("opacity", 0);
        });


    })
}

drawChart(csv);
