"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// kmeans
Array.range = function (count) {
    return Array.apply(null, Array(count)).map(function (_, i) {
        return i;
    });
};

function dots(orig, max_radius, num_dots) {
    var _orig = _slicedToArray(orig, 2);

    var x = _orig[0];
    var y = _orig[1];

    return Array.range(num_dots).map(function (dot) {
        var angle = Math.random() * 2 * 3.14159,
            radius = Math.random() * max_radius,
            dx = Math.cos(angle) * radius,
            dy = Math.sin(angle) * radius;
        return [x + dx, y + dy, -1];
    });
}

function dist(a, b) {
    var dx = Math.abs(a[0] - b[0]),
        dy = Math.abs(a[1] - b[1]);
    return Math.sqrt(dx * dx + dy * dy);
}

function min_dist(D) {
    return D.reduce(function (acc, d, idx) {
        return d < acc[1] ? [idx, d] : acc;
    }, [-1, Infinity])[0];
}

function classify(samples, kmeans) {
    return samples.map(function (sample) {
        return [sample[0], sample[1], min_dist(kmeans.map(function (mean) {
            return dist(sample, mean);
        }))];
    });
}

function mean(samples) {
    var n = samples.length;
    return samples.reduce(function (acc, sample) {
        return [acc[0] + sample[0] / n, acc[1] + sample[1] / n];
    }, [0, 0]);
}

function kmeans_step(classified, kmeans) {
    return kmeans.map(function (_, c) {
        return mean(classified.filter(function (sample) {
            return sample[2] === c;
        }));
    }).map(function (mean, c) {
        return [mean[0], mean[1], c];
    });
}

// visualisation
var ref = 1000,
    samples = [[[ref / 4, ref / 4], ref / 4, 200] // cluster 1
, [[ref * 0.75, ref / 4], ref / 4, 250] // cluster 2
, [[ref / 2, ref * 0.75], ref / 4, 150]] // cluster 3
.map(function (sample) {
    return dots.apply(null, sample);
}).reduce(function (acc, cur) {
    return acc.concat(cur);
}, []);

var kmeans = Array.range(3).map(function (mean, idx) {
    return [Math.random() * ref, Math.random() * ref, idx];
});

var aspect = Math.sqrt(2),
    width = document.getElementsByTagName("main")[0].offsetWidth / 1.2,
    height = width / aspect;

function draw(samples, kmeans) {
    d3.selectAll("svg").remove();
    var svg = d3.select("#k-means").append("svg").attr("width", width).attr("height", height).style("border-radius", "5px").style("background", "hsl(260, 50%, 95%)");

    function hsl(c) {
        return "hsl(" + c * 360 / kmeans.length + ", 70%, 60%)";
    }
    svg.selectAll(".dot").data(samples).enter().append("circle").attr("class", "dot").attr("cx", function (d) {
        return d[0] / ref * width;
    }).attr("cy", function (d) {
        return d[1] / ref * height;
    }).attr("r", width / 400).style("fill", function (d) {
        return d[2] >= 0 ? hsl(d[2]) : "#fff";
    });
    svg.selectAll(".mean").data(kmeans).enter().append("circle").attr("class", "mean").attr("cx", function (d) {
        return d[0] / ref * width;
    }).attr("cy", function (d) {
        return d[1] / ref * height;
    }).attr("r", width / 100).style("fill", function (d) {
        return hsl(d[2]);
    }).style("stroke", "#666");
}

// animation
var framesPerSecond = 5,
    timeout = 1000 / framesPerSecond;

draw(samples, kmeans);

setTimeout(function () {
    var classified = classify(samples, kmeans);
    draw(classified, kmeans);
    setTimeout(function () {
        return step(classified, kmeans);
    }, timeout);
}, timeout);

function step(samples, old_kmeans) {
    var kmeans = kmeans_step(samples, old_kmeans),
        classified = classify(samples, kmeans);
    draw(classified, kmeans);
    setTimeout(function () {
        return step(classified, kmeans);
    }, timeout);
}

