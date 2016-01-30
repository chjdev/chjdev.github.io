                   // 0      1      2      3      4      5        6       7      8          9
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
        // a tail recursion would be nicer
        return best_values.reduce(function (tree, v_i) {
            const examples_i = examples.filter(example => example[best_attrib] === v_i),
                  attribs_i = attribs.filter((_, idx) => idx !== +best_attrib),
                  subtree = decision_tree_learning(examples_i, attribs_i, attrib_strs, m);
            tree[attrib_strs[best_attrib]][v_i] = subtree;
            return tree;
        }, tree);
    }
}

function majority_value(examples) {
    return examples.map(example => example.slice(-1)[0])
                   .reduce(function (acc, cur, idx) {
                       acc[cur] ? acc[cur]++ : acc[cur] = 1;
                       if (acc[cur] > acc['__max'][0]) 
                           acc['__max'] = [acc[cur], cur];
                       return acc;
                   }, {'__max': [0, null]})['__max'][1];
}

function choose_attribute(attribs, examples) {
    return attribs.map(attribute => [attribute, distinct(examples.map(example => example[attribute]))])
                  .map(A => [A, gain(A, examples)])
                  .reduce((acc, cur, idx) => cur[1] > acc[1] ? cur : acc, [[], -1])[0];
}

function distinct(values) {
    return Object.keys(values.reduce(function (acc, cur) {
                                    acc[cur] = true;
                                    return acc;
                                }, {}));
}

function split_pn(examples, positive = "true") {
    const p = examples.filter(example => example.slice(-1)[0] === positive).length,
          n = examples.length - p;
    return [p, n];
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

function gain(A, examples) {
    var [p, n] = split_pn(examples);
    return I([p/(p+n), n/(p+n)]) - remainder(A, examples);
}

const tree_data = decision_tree_learning(examples, attribs, attrib_strs, false);
