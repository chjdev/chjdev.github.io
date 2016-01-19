// kmeans
Array.range = function (count) { return Array.apply(null, Array(count)).map((_, i) => i); };

function dots(orig, max_radius, num_dots) {
   const [x, y] = orig;
   return Array.range(num_dots)
               .map((dot) => {
                   const angle = Math.random() * 2 * 3.14159,
                         radius = Math.random() * max_radius,
                         dx = Math.cos(angle) * radius,
                         dy = Math.sin(angle) * radius;
                   return [x + dx, y + dy, -1];
               });
}

function dist(a, b) {
    const dx = Math.abs(a[0] - b[0]),
          dy = Math.abs(a[1] - b[1]);
    return Math.sqrt(dx*dx + dy*dy); 
}

function min_dist(D) {
    return D.reduce((acc, d, idx) => d < acc[1] ? [idx, d] : acc, [-1, Infinity])[0];
}

function classify(samples, kmeans) {
    return samples.map(sample => [sample[0], sample[1], min_dist(kmeans.map(mean => dist(sample, mean)))]);
}

function mean(samples) {
    const n = samples.length;
    return samples.reduce((acc, sample) => [acc[0] + sample[0] / n, acc[1] + sample[1] / n], [0, 0])
}

function kmeans_step(classified, kmeans) {
    return kmeans.map((_, c) => mean(classified.filter(sample => sample[2] === c)))
                 .map((mean, c) => [mean[0], mean[1], c])
}

// visualization
const ref = 1000,
      samples = [ [[ref/4, ref/4], ref/4, 200]      // cluster 1
                , [[ref*0.75, ref/4], ref/4, 250]   // cluster 2
                , [[ref/2, ref*0.75], ref/4, 150] ] // cluster 3
                .map(sample => dots.apply(null, sample))
                .reduce((acc, cur) => acc.concat(cur), []);

const kmeans = Array.range(3)
                    .map((mean, idx) => [Math.random() * ref, Math.random() * ref, idx]);

const aspect = Math.sqrt(2),
      width = document.getElementsByTagName("main")[0].offsetWidth / 1.2,
      height = width / aspect;

function draw(samples, kmeans) {
    d3.selectAll("svg").remove();
    const svg = d3.select("#k-means")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border-radius", "5px")
        .style("background", "hsl(260, 50%, 95%)");

    function hsl(c) {
        return "hsl(" + c * 360/(kmeans.length) + ", 70%, 60%)";
    }
    svg.selectAll(".dot")
        .data(samples)
        .enter()
          .append("circle")
          .attr("class", "dot")
          .attr("cx", d => (d[0] / ref) * width)
          .attr("cy", d => (d[1] / ref) * height)
          .attr("r", width/400)
          .style("fill", d => d[2] >= 0 ? hsl(d[2]) : "#fff");
    svg.selectAll(".mean")
        .data(kmeans)
        .enter()
          .append("circle")
          .attr("class", "mean")
          .attr("cx", d => (d[0] / ref) * width)
          .attr("cy", d => (d[1] / ref) * height)
          .attr("r", width/100)
          .style("fill", d => hsl(d[2]))
          .style("stroke", "#666");
}

// animation
const framesPerSecond = 5,
      timeout = 1000/framesPerSecond;

draw(samples, kmeans);

setTimeout(() => {
    const classified = classify(samples, kmeans);
    draw(classified, kmeans);
    setTimeout(() => step(classified, kmeans), timeout)
}, timeout);

function step(samples, old_kmeans) {
    const kmeans = kmeans_step(samples, old_kmeans),
          classified = classify(samples, kmeans);
    draw(classified, kmeans);
    setTimeout(() => step(classified, kmeans), timeout);
}
