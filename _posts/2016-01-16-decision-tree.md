---
title: What's a Decision Tree?
card_type: photo
image: /assets/2016/01/decision_tree.png
description: In this post I'll explain Decision Trees using JavaScript.
layout: post
---

<p class="message" style="text-align:center;">Note: work in progress!</p>

So what's a decision tree?

The full ECMAScript code can be found [here](/assets/2016/01/decision_tree.es)
or viewed directly on
[Github](https://github.com/chjdev/chjdev.github.io/tree/master/assets/2016/01/decision_tree.es).
A transpiled version using [Babel](https://babeljs.io) can be found
[here](/assets/2016/01/decision_tree.js).

The final rendering that you can see at the bottom uses
[D3.js](http://d3js.org) and is based on [this
example](https://gist.github.com/d3noob/8323795).

{% highlight javascript %}
function decision_tree_learning(examples, attribs, attrib_strs, def) {
    if (examples.length === 0) {
        return def;
    } else if (examples.every(example => example.slice(-1)[0] === examples[0].slice(-1)[0])) {
        // classification is same for all
        return examples[0].slice(-1)[0];
    } else if (attribs.length === 0) {
        return majority_value(examples);
    } else {
        const [best_attrib, best_values] = choose_attribute(attribs, examples),
              tree = {},
              m = majority_value(examples);
        tree[attrib_strs[best_attrib]] = {};
        return best_values.reduce(function (tree, v_i) {
            const examples_i = examples.filter(example => example[best_attrib] === v_i),
                  attribs_i = attribs.filter((_, idx) => idx !== +best_attrib),
                  subtree = decision_tree_learning(examples_i, attribs_i, attrib_strs, m);
            tree[attrib_strs[best_attrib]][v_i] = subtree;
            return tree;
        }, tree);
    }
}
{% endhighlight %}

``majority_value`` returns the value that occured most often.

{% highlight javascript %}
function choose_attribute(attribs, examples) {
    return attribs.map(attribute => [attribute, distinct(examples.map(example => example[attribute]))])
                  .map(A => [A, gain(A, examples)])
                  .reduce((acc, cur, idx) => cur[1] > acc[1] ? cur : acc, [[], -1])[0];
}
{% endhighlight %}

``distinct`` is a helper function returning an array with the distinct values of the input.

{% highlight javascript %}
function gain(A, examples) {
    var [p, n] = split_pn(examples);
    return I([p/(p+n), n/(p+n)]) - remainder(A, examples);
}

function I(P) {
    return P.filter(v_i => v_i > 0)
            .map(v_i => -v_i*Math.log2(v_i))
            .reduce((a,b) => a + b, 0);
}

function remainder(A, examples) {
    const [p, n] = split_pn(examples);
    return A[1].reduce(function (prev, cur) {
        const examples_cur = examples.filter(example => example[A[0]] === cur),
            [p_i, n_i] = split_pn(examples_cur);
        if (examples_cur.length === 0) {
            return prev + 0;
        } else {
            return prev + ((p_i+n_i)/(p+n) * I([p_i/(p_i + n_i), n_i/(p_i + n_i)]));
        }
    }, 0);
}
{% endhighlight %}

``split_pn`` is just a simple function that splits the ``examples`` into positive (``"true"``) and negative (``"false"``) instances.

<!-- rendering code -->
<div id="tree_diagram" class="bg-image"></div>
<script src="//d3js.org/d3.v3.min.js"></script>
<script src="/assets/2016/01/decision_tree.js"></script>
<style>
    .node circle {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 3px;
    }
    .node text { font: 12px sans-serif; }
    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }
</style>
<script>
function convert_to_d3(tree) {
    var mroot = Object.keys(tree)[0];
    return (function _convert_to_d3(name, par, tree) {
        if (typeof tree ==='object') {
            return { 'name': name
                   , 'parent': par
                   , 'children': Object.keys(tree).map(function (key) {return _convert_to_d3(key, name, tree[key]);})
                   };
        } else {
            return { 'name': name
                   , 'leaf': tree
                   , 'parent': par
                   };
        }
    })(mroot, 'null', tree[mroot]);
}

function draw_tree() {
    //adapted from: https://gist.github.com/d3noob/8323795)

    var d3_tree = convert_to_d3(tree_data),
        margin = {top: 20, right: 50, bottom: 20, left: 50},
        aspect = 16 / 9;
        orig_width = document.getElementsByTagName("main")[0].offsetWidth,
        width = orig_width - margin.right - margin.left,
        orig_height = orig_width / aspect,
        height =  orig_height - margin.top - margin.bottom;
        
    var i = 0;
    var tree = d3.layout.tree()
        .size([height, width]);
    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });
    d3.selectAll("svg").remove();
    var svg = d3.select("#tree_diagram").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
    update(d3_tree);
    function update(source) {
      // Compute the new tree layout.
      var nodes = tree.nodes(d3_tree).reverse(),
          links = tree.links(nodes);
      // Declare the nodes…
      var node = svg.selectAll("g.node")
          .data(nodes, function(d) { return d.id || (d.id = ++i); });
      // Enter the nodes.
      var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { 
              return "translate(" + d.y + "," + d.x + ")"; });
      nodeEnter.append("circle")
          .attr("r", 10)
          .style("fill", function(d) {
                if (d.children || d._children) return "#ccc";
                else if (d.leaf) return d.leaf === 'true' ? "#55ff55" : "#ff5555";
                else return "#fff";
            });
      nodeEnter.append("text")
          .attr("x", -15)
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1);
      // Declare the links…
      var link = svg.selectAll("path.link")
          .data(links, function(d) { return d.target.id; });
      // Enter the links.
      link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("d", diagonal);
    }
}
window.onresize = draw_tree;
draw_tree();
</script>
