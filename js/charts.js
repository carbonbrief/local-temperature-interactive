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
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.anomaly); });

// var color = d3.scaleOrdinal()
//     // thinking it might be nice to do a different colour for an average
//     .domain(["Africa and Middle East", "China", "EU28", "Former USSR", "India", "Latin America", "Non-EU Europe", "Other",  "Other Asia", "United States"])
//     .range(["#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e"]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

// var line = d3.line()
//     .curve(d3.curveCardinal) // see http://bl.ocks.org/emmasaunders/c25a147970def2b02d8c7c2719dc7502 for more details
//     .x(function(d) { return x(d.year); })
//     .y(function(d) { return y(d.capacity); });

var svg = d3.select("#graph1").append("svg")
    .attr("id", "svg-1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(",.0f");

var csv = "../data/charts/gridcell_" + 89.5 + "_" + 150.5 + ".csv";

function drawChart(){
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.anomaly = +d.obs_anoms;
        });

          // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.year; }));
        y.domain(d3.extent(data, function(d) { return d.anomaly; }));

        // Add the valueline path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line);

        // Add the X Axis
        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .call(d3.axisLeft(y));


    })
}

drawChart(csv);
