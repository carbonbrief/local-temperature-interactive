var margin = {top: 10, right: 25, bottom: 20, left: 35},
    // calculate the width of the chart from the width of the line-wrapper
    width = parseInt(d3.select("#graph1").style("width")) - margin.left - margin.right,
    height = 220 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");
// var parseDate2 = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var valueLineInitial = d3.line()
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    // set to 0 initially
    .y(function(d) { return y(0); }); 

// define the line
var valueLine = d3.line()
    .defined(function(d) { return d.anomaly != 0; }) // remove values with exactly 0, since these are the nulls
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.anomaly); });

// var multiValueLine = d3.line()
//     .defined(function(d) { return d.anomaly != 0; })
//     .curve(d3.curveCardinal)

var zeroLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(0); });

// for the second chart
var color = d3.scaleOrdinal()
    .domain(["obs_anoms", "rcp26", "rcp45", "rcp60", "rcp85"])
    // follows the colours of the map somewhat since implying the same thing
    // will need a second scale since they're not exactly the same
    // note the order of the data matters
    .range(["#F0f73f", "#ffffff", "#802ba4", "#Ca4a78", "#f79649"]);

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

var svg2 = d3.select("#graph2").append("svg")
    .attr("id", "svg-2")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(",.2f");

var t = d3.transition()
    .delay(1500)
    .duration(7000)
    .ease(d3.easeSin);

// placeholder data
var initialCsv = "./data/charts/gridcell_" + "89.5" + "_" + "150.5" + ".csv";

var csv;

// columns to show in the multiline chart
var filterData = {"obs_anoms":true,"rcp26":true,"rcp45":true, "rcp60": true, "rcp85":true};

function drawChart1(){
    d3.csv(initialCsv, function(error, data) {

        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.anomaly = +d.obs_anoms; // this is the bit that turns blanks to 0
        });

        x.domain([parseDate(1850), parseDate(2020)]);
        y.domain(d3.extent(data, function(d) { return d.anomaly; }));

        // Add the axis label (before line so always underneath)

        svg.append("text")
        .attr("class", "axis label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .text("Temperature anomaly (C)");

        // Add the line at zero.
        svg.append("path")
        .data([data])
        .attr("class", "zero-line")
        .attr("d", zeroLine);

        // Add the X Axis
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        // Add the valueline path.
        svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueLineInitial);


    })
}

function updateChart1(csv) {

    // get the data again
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
            d.anomaly = +d.obs_anoms; // this is the bit that turns blanks to 0
        });

        // Scale the range of the data again 
        y.domain((d3.extent(data, function(d) { return d.anomaly; }))*1.1);

        // Make the changes
       svg.selectAll(".line")   // change the line
            .data([data])
            .transition(t)
            .attr("d", valueLine);
        svg.select(".y.axis") // change the y axis
            .transition(t)
            .call(yAxis);

        // Add hover circles

        // remove old circles before appending new ones
        svg.select(".hover-circles").remove();

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
            .style("opacity", .95);
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

    });

}

function drawChart2() {
    d3.csv(initialCsv, function(error, data) {

        if (error) throw error;

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var scenarios = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    anomaly: +d[name]
                };
            })
            };
        });

        var scenariosFiltered = scenarios.filter(function(d){return filterData[d.name]==true;});

        console.log(scenariosFiltered);

        x.domain([parseDate(2010), parseDate(2100)]);
        y.domain([
            d3.min(scenariosFiltered, function(c) { return d3.min(c.values, function(v) { return v.anomaly; }); }),
            d3.max(scenariosFiltered, function(c) { return d3.max(c.values, function(v) { return v.anomaly; }); })
        ]);

        svg2.append("text")
        .attr("class", "axis label")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .text("Temperature anomaly (C)");

        // Add the line at zero.
        svg2.append("path")
        .data(scenariosFiltered)
        .attr("class", "zero-line")
        .attr("d", zeroLine);

        // Add the X Axis
        svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

        // Add the Y Axis
        svg2.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

        var multilines = svg2.selectAll(".multiline")
        .data(scenariosFiltered)
        .enter().append("g");

        multilines.append("clipPath")
        .attr("id", "graph-clip")
        .append("rect")
        .attr("width", width) 
        .attr("height", height); 

        multilines.append("path")
        .data(scenariosFiltered)
        .attr("class", "line")
        .attr("clip-path","url(#graph-clip)")
        .attr("d", function(d) { return valueLine(d.values); })
        .style("stroke", function(d) { return color(d.name); });


    })
}

drawChart2(filterData);

setTimeout (function() {
    drawChart1();
}, 6000);

// DRAW CHART WHEN MAP CLICKED

document.getElementById('map').addEventListener("click", function () {

    var csv = "./data/charts/gridcell_" + midCoordLat + "_" + midCoordLong + ".csv";

    updateChart1(csv);


});


