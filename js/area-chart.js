var margin = {
    top: 10, 
    right: 25, 
    bottom: 28, 
    left: 37
},
    // calculate the width of the chart from the width of the line-wrapper
    width = parseInt(d3.select("#graph1").style("width")) - margin.left - margin.right,
    height = parseInt(d3.select("#graph1").style("height")) - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

// var xAxis = d3.axisBottom()
//     .scale(x);

// var yAxis = d3.axisLeft()
//     .scale(y);

var svg3 = d3.select("#graph1").append("svg")
    .attr("id", "svg-3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var area = d3.area()
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y0(function(d) { return y(d.obs_anoms - d.uncertainty); })
    .y1(function(d) { return y(d.obs_anoms + d.uncertainty); });

var t = d3.transition()
    .duration(2000) //shortened duration to avoid issues if second square is clicked before first transition completes
    .ease(d3.easeQuad);

var csv;

// placeholder data
var initialCsv = "./data/charts/gridcell_" + "89.5" + "_" + "150.5" + ".csv";

function drawUncertainty(){
    d3.csv(initialCsv, function(error, data) {

        if (error) throw error;

        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.obs_anoms = +d.obs_anoms;
            d.uncertainty = +d.uncertainty;
        });

        // keep same as line chart
        x.domain([
            d3.min(data, function(d) {return d.year;}), 
            parseDate(2020)
        ]);
        y.domain([
            -2,
            4
        ]);

        svg3.append("clipPath")
        .attr("id", "graph-clip")
        .append("rect")
        .attr("width", width) 
        .attr("height", height); 

        svg3.append("path")
        .data([data])
        .attr("class", "area")
        .attr("clip-path","url(#graph-clip)")
        .attr("d", area);

    })
}

function updateUncertainty (csv) {

    // get the data again
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.obs_anoms = +d.obs_anoms;
            d.uncertainty = +d.uncertainty;
        });

        var calcMax = d3.max(data, function(d) { return d.obs_anoms; });
        var calcMin = d3.min(data, function(d) { return d.obs_anoms; });

        var yMax = function () {
            if (calcMax > 2.9) {
                return calcMax + 0.1;
            } else {
                return 3;
            }
        }

        var yMin = function () {
            if (calcMin < -1.9) {
                return calcMin - 0.1;
            } else {
                return -2;
            }
        }

        // Scale the range of the data again 
        x.domain([
            parseDate(1850),
            parseDate(2020)
        ]);
        y.domain([
            yMin(),
            yMax()
        ]);

        // Make the changes
        svg3.selectAll(".area")
        .data([data])
        .transition(t)
        .attr("d", area);

    })

}

drawUncertainty();