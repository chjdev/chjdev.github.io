"use strict";

function initGraph(data, raw_width_in, std_error) {
    var margin = { top: 30, right: 90, bottom: 50, left: 90 },
        aspect = Math.sqrt(2),
        raw_width = raw_width_in,
        raw_height = raw_width / aspect,
        width = raw_width - margin.left - margin.right,
        height = raw_height - margin.top - margin.bottom;

    var x = d3.scale.linear().range([0, width]),
        left = d3.scale.linear().range([height, 0]),
        right = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10).tickFormat(d3.format("s")),
        leftAxis = d3.svg.axis().scale(left).orient("left").ticks(20).tickFormat(d3.format("s")),
        rightAxis = d3.svg.axis().scale(right).orient("right").ticks(20).tickFormat(d3.format("s"));

    var throughput = d3.svg.area().x(function (d) {
        return x(d[0]);
    }).y0(function (d) {
        return left(d[3]);
    }).y1(function (d) {
        return left(0);
    }),
        stderrorarea = d3.svg.area().x(function (d) {
        return x(d[0]);
    }).y0(function (d) {
        return right((1 + std_error) * d[2]);
    }).y1(function (d) {
        return right((1 - std_error) * d[2]);
    }).interpolate('monotone'),
        valueline = d3.svg.line().x(function (d) {
        return x(d[0]);
    }).y(function (d) {
        return right(d[1]);
    }).interpolate('monotone'),
        goldline = d3.svg.line().x(function (d) {
        return x(d[0]);
    }).y(function (d) {
        return right(d[2]);
    }).interpolate('monotone');

    d3.selectAll("#chart > svg").remove();
    var svg = d3.selectAll("#chart").append("svg").attr("width", raw_width).attr("height", raw_height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("path").attr("class", "area throughput").attr("d", throughput(data));
    svg.append("path").attr("class", "line value").attr("d", valueline(data));
    svg.append("path").attr("class", "line gold").attr("d", goldline(data));
    svg.append("path").attr("class", "area stderror").attr("d", stderrorarea(data));
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("text").attr("transform", "translate(" + width / 2 + " ," + height + ")").attr("dy", margin.bottom - 2).style("text-anchor", "middle").style("font-size", "1.4rem").text("# Visits");
    svg.append("g").attr("class", "y left axis").call(leftAxis);
    svg.append("text").attr("transform", "rotate(-90)").attr("y", 0).attr("x", 0 - height / 2).attr("dy", -margin.left * 2 / 3).style("text-anchor", "middle").style("font-size", "1.4rem").text("Throughput (# Visits / second)");
    svg.append("g").attr("class", "y right axis").attr("transform", "translate(" + width + ",0)").call(rightAxis);
    svg.append("text").attr("transform", "rotate(-90)").attr("y", width).attr("x", 0 - height / 2).attr("dy", margin.left * 4 / 5).style("text-anchor", "middle").style("font-size", "1.4rem").text("Cardinality");
    svg.append("rect").attr("transform", "translate(" + (width - margin.right) + ", " + height + ")").attr("x", "-1.4em").attr("y", "-4.9em").attr("width", "1em").attr("height", "1em").style("stroke", "none").style("stroke", "black").style("fill", "steelblue");
    svg.append("text").attr("transform", "translate(" + width + " ," + height + ")").attr("dy", "-4em").attr("dx", -margin.right).style("text-anchor", "start").text("Estimate");
    svg.append("rect").attr("transform", "translate(" + (width - margin.right) + ", " + height + ")").attr("x", "-1.4em").attr("y", "-3.4em").attr("width", "1em").attr("height", "1em").style("stroke", "none").style("stroke", "black").style("fill", "red");
    svg.append("text").attr("transform", "translate(" + width + " ," + height + ")").attr("dy", "-2.5em").attr("dx", -margin.right).style("text-anchor", "start").text("Actual");
    svg.append("rect").attr("transform", "translate(" + (width - margin.right) + ", " + height + ")").attr("x", "-1.4em").attr("y", "-1.9em").attr("width", "1em").attr("height", "1em").style("stroke", "black").style("fill", "lightgrey");
    svg.append("text").attr("transform", "translate(" + width + " ," + height + ")").attr("dy", "-1em").attr("dx", -margin.right).style("text-anchor", "start").text("Throughput");

    return function updateGraph(data) {
        if (typeof data == 'undefined' || data.length == 0) return;

        x.domain([0, data.slice(-1)[0][0]]);
        if (data.slice(-1)[0][2] != 0) {
            right.domain([0, (1 + std_error) * data.slice(-1)[0][2]]);
        } else {
            right.domain([0, 1.02 * data.slice(-1)[0][1]]);
        }
        left.domain([0, d3.max(data, function (d) {
            return d[3];
        })]);

        var svg = d3.selectAll("#chart").transition();
        svg.select(".x.axis").duration(750).call(xAxis);
        svg.select(".left.axis").duration(750).call(leftAxis);
        svg.select(".right.axis").duration(750).call(rightAxis);
        svg.select(".line.value").attr("d", valueline(data));
        svg.select(".line.gold").attr("d", goldline(data));
        svg.select(".area.stderror").attr("d", stderrorarea(data));
        svg.select(".area.throughput").attr("d", throughput(data));
    };
}

