---
title: What's a Decision Tree?
card_type: photo
image: /assets/2016/01/decision_tree.png
description: In this post I'll explain Decision Trees using JavaScript.
render: <div id="tree_diagram"></div>
layout: post
---

<p class="message">Firefox is having some trouble with columns. I'm on it, please use Chrome or Safari in the meantime.</p>

This post is based on the chapter
in the great book: [Artificial Intelligence: A Modern
Approach](http://www.amazon.com/Artificial-Intelligence-Modern-Approach-3rd/dp/0136042597/)

So what's a decision tree? Simply put a way to make predictions based on
observations from a knowledge base. Let's say we observed the following
behavior data set for deciding whether to wait for a table at a restaurant.  It
contains twelve observations in total and is based on 10 attributes.

{% highlight javascript %}
const attrib_strs = ["Alt", "Bar", "Fri", "Hun", "Pat", "Price", "Rain", "Res", "Type", "Est", "WillWait"],
      attribs = Object.keys(attrib_strs).slice(0, -1),
      examples = [ ["true", "false", "false", "true", "1", "3", "false", "true", "french", "10", "true"]
               , ["true", "false", "false", "true", "2", "1", "false", "false", "thai", "40", "false"]
               , ["false", "true", "false", "false", "2", "1", "false", "false", "burger", "10", "true"]
               , ["true", "false", "true", "true", "2", "1", "true", "false", "thai", "30", "true"]
               , ["true", "false", "true", "false", "2", "3", "false", "true", "french", "100", "false"]
               , ["false", "true", "false", "true", "1", "2", "true", "true", "italian", "10", "true"]
               , ["false", "true", "false", "false", "0", "1", "true", "false", "burger", "10", "false"]
               , ["false", "false", "false", "true", "1", "2", "true", "true", "thai", "10", "true"]
               , ["false", "true", "true", "false", "2", "1", "true", "false", "burger", "100", "false"]
               , ["true", "true", "true", "true", "2", "3", "false", "true", "italian", "30", "false"]
               , ["false", "false", "false", "false", "0", "1", "false", "false", "thai", "10", "false"]
               , ["true", "true", "true", "true", "2", "1", "false", "false", "burger", "60", "true"]
               ];
{% endhighlight %}

The goal now is to see if there is a pattern in this data that allows us to predict whether a new
observation based on these attributes will yield a positive or negative decision for the "will wait?"
question.

But how can we model this decision? Decision Trees to the rescue! In this model we try to build a
tree that leads us through intermediate decisions (stored in internal nodes) to a definite decision
(stored in it's leaves) with the minimum steps required. Trivially one might just create a branch
for each example, however this is very inefficient and has terribly predictive performance for new
unobserved examples.

This whole idea actually more intuitive than it sounds, let's look at the algorithm as
defined in the
[book](http://www.amazon.com/Artificial-Intelligence-Modern-Approach-3rd/dp/0136042597/):

> 1. If there are some positive and some negative examples, then choose the
>    best attribute to split them.
> 2. If all the remaining examples are positive (or all negative), then we are
>    done: we can answer Yes or No.
> 3. If there are no examples left, it means that no such example has been
>    observed, and we return a default value calculated from the majority
>    classification at the node's parent.
> 4. If there are no attributes left, but both positive and negative examples,
>    we have a problem. It means that these examples have exactly the same
>    description, but different classifications. This happens when some of the
>    data are incorrect; we say there is noise in the data. It also happens
>    either when the attributes do not give enough information to describe the
>    situation fully, or when the domain is truly nondeterministic. One simple
>    way out of the problem is to use a majority vote.

Alright, so basically it's a recursion that tries to find the attribute that best splits the remaining
examples in each step.

Let's translate this into code! The full ECMAScript code can be found
[here](/assets/2016/01/decision_tree.es) or viewed directly on
[Github](https://github.com/chjdev/chjdev.github.io/tree/master/assets/2016/01/decision_tree.es).
A transpiled version using [Babel](https://babeljs.io) can be found
[here](/assets/2016/01/decision_tree.js).

The final (live) rendering that you can see at the bottom uses
[D3.js](http://d3js.org) and is based on [this
example](https://gist.github.com/d3noob/8323795).

First of the main ``decision_tree_learning`` function. It's basically a 1:1 translation of the
informal description above.

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

The function ``majority_value`` returns the ``WillWait`` value that occured most often for this
subset of examples.

Next of is the ``choose_attribute`` function that selects the attribute that
yields the best split of the example subset. That's pretty much it for the
decision tree itself. the ``choose_attribute`` function is generic and can use
different heuristics.  Here we'll use a heuristic that is based on which
attribute provides the highest "information gain".

{% highlight javascript %}
function choose_attribute(attribs, examples) {
    return attribs.map(attribute => [attribute, distinct(examples.map(example => example[attribute]))])
                  .map(A => [A, gain(A, examples)])
                  .reduce((acc, cur, idx) => cur[1] > acc[1] ? cur : acc, [[], -1])[0];
}
{% endhighlight %}

``distinct`` is a helper function returning an array with the distinct values
of the input array, in this case the different values
for an attribute.


As stated the heuristic in this example is "information gain" the mathematical
details are beyond the scope of this quick post. You can find the details in
the book or [here](https://en.wikipedia.org/wiki/Information_gain_ratio).  In
general, the information gain from the attribute test is the difference between
the original information requirement (in bits) and the new requirement.

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

And that's it. The resulting tree for running this code can be seen at the bottom.

**Note:** the tree we arrived at here is slightly different than Russel's & Norvig's, it's
actually slightly smaller! If that's due to a bug in my implementation please let me know ;) 

<!-- rendering code -->
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
    document.getElementById('tree_diagram').style.display='none';
    document.getElementById('tree_diagram').offsetHeight;
    document.getElementById('tree_diagram').style.display='block';
}
window.onresize = draw_tree;
draw_tree();
</script>
