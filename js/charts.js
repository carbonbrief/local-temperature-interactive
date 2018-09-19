// other variables in area-chart.js

// define the line
var valueLine = d3.line()
    .defined(function(d) { return d.anomaly != 0; }) // remove values with exactly 0, since these are the nulls
    .curve(d3.curveCardinal)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.anomaly); });

var zeroLine = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(0); });

// for the second chart
var color = d3.scaleOrdinal()
    .domain(["obs_anoms", "rcp26", "rcp45", "rcp60", "rcp85"])
    // follows the colours of the map somewhat since implying the same thing
    // note the order of the data matters
    .range(["#ffffff", "#9753B5", "#Ca4a78", "#f79649", "#F0f73f"]);

// for the first chart
var color2 = d3.scaleOrdinal()
    .domain(["obs_anoms", "smoothed_anoms"])
    .range(["#ffffff", "#Ca4a78"]);

var lineWidth = {
    "obs_anoms": 1,
    "smoothed_anoms": 2.5
}

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var div1 = d3.select("body").append("div")
    .attr("id", "tooltip1")
    .attr("class", "tooltip")
    .style("opacity", 0);

var div2 = d3.select("body").append("div")
    .attr("id", "tooltip2")
    .attr("class", "tooltip")
    .style("opacity", 0);

var t = d3.transition()
    .duration(2000) //shortened duration to avoid issues if second square is clicked before first transition completes
    .ease(d3.easeQuad);

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

// columns to show in the multiline chart
var filterData = {"obs_anoms":true,"rcp26":true,"rcp45":true, "rcp60": true, "rcp85":true};

// columns to show in the first chart
var filterData2 = {"obs_anoms":true,"smoothed_anoms":true};

// array to get column names in better format
var getName = {
    "obs_anoms": "Observed",
    "smoothed_anoms": "Smoothed average",
    "rcp26": "RCP 2.6",
    "rcp45": "RCP 4.5", 
    "rcp60": "RCP 6.0", 
    "rcp85": "RCP 8.5"
}

function drawChart1(){
    d3.csv(initialCsv, function(error, data) {

        if (error) throw error;

        // select exact columns since there are extra columns we won't be using
        color2.domain(d3.keys(data[0]).filter(function(key) { return key == "obs_anoms" || key == "smoothed_anoms"}));
        
        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var scenarios = color2.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    anomaly: +d[name] // this is the bit that turns blanks to 0
                };
            })
            };
        });

        var scenariosFiltered = scenarios.filter(function(d){return filterData2[d.name]==true;});

        x.domain([
            // (d3.min(scenariosFiltered, function(c) { return d3.min(c.values, function(v) { return v.year; }); })*1.1),
            d3.min(data, function(d) {return d.year;}), 
            parseDate(2020)
        ]);
        y.domain([
            -2,
            4
        ]);

        // Add the axis label (before line so always underneath)

        svg.append("text")
        .attr("class", "axis label")
        // .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", 8)
        .attr("dy", ".5em")
        .style("text-anchor", "start")
        .text("Temperature anomaly (C)");

        svg.append("clipPath")
        .attr("id", "graph-clip")
        .append("rect")
        .attr("width", width) 
        .attr("height", height); 

        // Add the line at zero.
        svg.append("path")
        .data([data])
        .attr("class", "zero-line")
        .attr("clip-path","url(#graph-clip)")
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

        var multilines = svg.selectAll(".multiline")
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
        .style("stroke", function(d) { return color2(d.name); })
        .style("stroke-width", function(d) { return lineWidth[d.name]; });
        // .on("mouseover", mouseover1)
        // .on("mouseout", mouseout1);


    })
}

function updateChart1(csv) {

    // get the data again
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        color2.domain(d3.keys(data[0]).filter(function(key) { return key == "obs_anoms" || key == "smoothed_anoms"}));

        // format the data
        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var scenarios = color2.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    anomaly: +d[name] // this is the bit that turns blanks to 0
                };
            })
            };
        });

        var scenariosFiltered = scenarios.filter(function(d){return filterData2[d.name]==true;});

        var calcMax = d3.max(scenariosFiltered, function(c) { return d3.max(c.values, function(v) { return v.anomaly; }); });
        var calcMin = d3.min(scenariosFiltered, function(c) { return d3.min(c.values, function(v) { return v.anomaly; }); });


        // y axis should change if the max value is over 2.9 but otherwise remain fixed at 3

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
       svg.selectAll(".line")   // change the line
       .data(scenariosFiltered)
       .transition(t)
       .attr("d", function(d) { return valueLine(d.values); })
       .style("stroke", function(d) { return color2(d.name); });

        // change the y axis
        svg.select(".y.axis")
        .transition(t)
        .call(yAxis);

        // change the x axis
        svg.select(".x.axis")
        .transition(t)
        .call(xAxis);

        // update the position of the zeroline
        svg.select(".zero-line")
        .transition(t)
        .attr("d", zeroLine);

        // Add hover circles

        // remove old circles before appending new ones
        svg.selectAll(".hover-circles1").remove();

        var circles = svg.selectAll(".hover-circles1")
        .data(scenariosFiltered)
        .enter()
        .append("g")
        .attr("class", "hover-circles1");
        
        circles.selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        // .filter(function(d) { return d.anomaly != 0 })
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.anomaly); })
        // in order to have a the circle to be the same color as the line, you need to access the data of the parentNode
        .attr("fill", function(d){return color2(this.parentNode.__data__.name)})
        .attr("opacity", 0)
        .on("mouseover", function(d) {

            var name = this.parentNode.__data__.name;

            //show circle
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .attr("r", 5);

            // show tooltip
            div1.transition()
            .duration(100)
            .style("opacity", .95);
            div1.html("<h3 style= color:" + color2(name) + 
            ";>" + getName[name] +
            "</h3><p><span class='label-title'>Year: </span>" + yearFormat(d.year) + 
            "</p><p><span class='label-title'>Anomaly: </span>" + decimalFormat(d.anomaly) + 
            "C</p>")
            .style("left", (d3.event.pageX - 58) + "px")
            .style("top", (d3.event.pageY - 100) + "px");

            // highlight line actions
            var lines = svg.selectAll('.line');

            lines.filter(function (d) { return d.name != name; })
            .transition()
            .duration(100)
            .style("opacity", 0.6);

            var thisLine = svg.selectAll('.line');

            thisLine.filter(function (d) { return d.name == name; })
            .transition()
            .duration(100)
            .style("stroke-width", function(d) {
                if (d.name == "obs_anoms") {
                    return 1.5;
                } else if (d.name == "smoothed_anoms") {
                    return 3;
                }
            });


         })
        .on("mouseout", function(d) {

            // hide circles
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("r", 4);

            // hide tooltip
            div1.transition()
            .duration(200)
            .style("opacity", 0);

            // reset opacity of lines
            svg.selectAll(".line")
            .transition()
            .duration(100)
            .style("opacity", 1)
            .style("stroke-width", function(d) { return lineWidth[d.name]; });

        });

    });

}

function drawChart2() {
    d3.csv(initialCsv, function(error, data) {

        if (error) throw error;

        // select exact columns since there are extra columns we won't be using
        color.domain(d3.keys(data[0]).filter(function(key) { return key == "obs_anoms" || key == "rcp26" || key == "rcp45" || key == "rcp60" || key == "rcp85" ; }));

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

        // console.log(scenariosFiltered);

        x.domain([parseDate(2000), parseDate(2100)]);
        y.domain([
            (d3.min(scenariosFiltered, function(c) { return d3.min(c.values, function(v) { return v.anomaly; }); })*1.1),
            (d3.max(scenariosFiltered, function(c) { return d3.max(c.values, function(v) { return v.anomaly; }); })*1.2)
        ]);

        svg2.append("text")
        .attr("class", "axis label")
        // .attr("transform", "rotate(-90)")
        .attr("y", 5)
        .attr("x", 8)
        .attr("dy", ".5em")
        .style("text-anchor", "start")
        .text("Temperature anomaly (C)");

        // Add the line at zero.
        svg2.append("path")
        .data([data])
        .attr("class", "zero-line")
        .attr("clip-path","url(#graph-clip)")
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
        .style("stroke", function(d) { return color(d.name); })
        .style("stroke-width", "1.5");


    })
}

function updateChart2 (csv) {

    // get the data again
    d3.csv(csv, function(error, data) {

        if (error) throw error;

        color.domain(d3.keys(data[0]).filter(function(key) { return key == "obs_anoms" || key == "rcp26" || key == "rcp45" || key == "rcp60" || key == "rcp85" ; }));

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

        // scale the range of y domain
        x.domain([parseDate(2000), parseDate(2100)]);
        y.domain([
            (d3.min(scenariosFiltered, function(c) { return d3.min(c.values, function(v) { return v.anomaly; }); })*1.1),
            (d3.max(scenariosFiltered, function(c) { return d3.max(c.values, function(v) { return v.anomaly; }); })*1.2)
        ]);

        // Make the changes
       svg2.selectAll(".line")   // change the line
       .data(scenariosFiltered)
       .transition(t)
       .attr("d", function(d) { return valueLine(d.values); })
       .style("stroke", function(d) { return color(d.name); });

        svg2.select(".y.axis") // change the y axis
        .transition(t)
        .call(yAxis);

        // update the position of the zeroline
        svg2.select(".zero-line")
        .transition(t)
        .attr("d", zeroLine);

        // Add hover circles

        // remove old circles before appending new ones
        // make sure that 'selectAll' rather than select is use since it is a multiline chart
        svg2.selectAll(".hover-circles2").remove();

        var circles2 = svg2.selectAll(".hover-circles2")
        .data(scenariosFiltered)
        .enter()
        .append("g")
        .attr("class", "hover-circles2");
        
        circles2.selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        // .filter(function(d) { return values[d.anomaly] != 0 })
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.year) })
        .attr("cy", function(d) { return y(d.anomaly) })
        // in order to have a the circle to be the same color as the line, you need to access the data of the parentNode
        .attr("fill", function(d){return color(this.parentNode.__data__.name)})
        .attr("opacity", 0)
        .on("mouseover", function(d) {

            var name = this.parentNode.__data__.name;

            //show circle
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.6)
            .attr("r", 5);

            // show tooltip
            div2.transition()
            .duration(100)
            .style("opacity", .95);
            div2.html("<h3 style= color:" + color(name) + 
            ";>" + getName[name] +
            "</h3><p><span class='label-title'>Year: </span>" + yearFormat(d.year) + 
            "</p><p><span class='label-title'>Anomaly: </span>" + decimalFormat(d.anomaly) + 
            "C</p>")
            .style("left", (d3.event.pageX - 55) + "px")
            .style("top", (d3.event.pageY - 100) + "px");

            // highlight line actions
            var lines = svg2.selectAll('.line');

            lines.filter(function (d) { return d.name != name; })
            .transition()
            .duration(100)
            .style("opacity", 0.6);

            var thisLine = svg2.selectAll('.line');

            thisLine.filter(function (d) { return d.name == name; })
            .transition()
            .duration(100)
            .style("stroke-width", "2");


        })
        .on("mouseout", function(d) {

            // hide circles
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("r", 4);

            // hide tooltip
            div2.transition()
            .duration(200)
            .style("opacity", 0);

            // reset opacity of lines
            svg2.selectAll(".line")
            .transition()
            .duration(100)
            .style("opacity", 1)
            .style("stroke-width", "1.5");
        });

    });

}

// for some reason it needs to go here or it breaks??
drawChart2();
drawChart1();

// DRAW CHART WHEN MAP CLICKED

document.getElementById('map').addEventListener("click", function () {

    csv = "./data/charts/gridcell_" + midCoordLat + "_" + midCoordLong + ".csv";

    updateChart1(csv);
    updateChart2(csv);
    updateUncertainty(csv);


});


