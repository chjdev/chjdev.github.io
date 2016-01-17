"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// 0      1      2      3      4      5        6       7      8          9
var attrib_strs = ["Alt", "Bar", "Fri", "Hun", "Pat", "Price", "Rain", "Res", "Type", "Est", "WillWait"],
    attribs = Object.keys(attrib_strs).slice(0, -1),
    examples = [["true", "false", "false", "true", "1", "3", "false", "true", "french", "10", "true"], ["true", "false", "false", "true", "2", "1", "false", "false", "thai", "40", "false"], ["false", "true", "false", "false", "2", "1", "false", "false", "burger", "10", "true"], ["true", "false", "true", "true", "2", "1", "true", "false", "thai", "30", "true"], ["true", "false", "true", "false", "2", "3", "false", "true", "french", "100", "false"], ["false", "true", "false", "true", "1", "2", "true", "true", "italian", "10", "true"], ["false", "true", "false", "false", "0", "1", "true", "false", "burger", "10", "false"], ["false", "false", "false", "true", "1", "2", "true", "true", "thai", "10", "true"], ["false", "true", "true", "false", "2", "1", "true", "false", "burger", "100", "false"], ["true", "true", "true", "true", "2", "3", "false", "true", "italian", "30", "false"], ["false", "false", "false", "false", "0", "1", "false", "false", "thai", "10", "false"], ["true", "true", "true", "true", "2", "1", "false", "false", "burger", "60", "true"]];

function decision_tree_learning(examples, attribs, attrib_strs, def) {
    if (examples.length === 0) {
        return def;
    } else if (examples.every(function (example) {
        return example.slice(-1)[0] === examples[0].slice(-1)[0];
    })) {
        // classification is same for all
        return examples[0].slice(-1)[0];
    } else if (attribs.length === 0) {
        return majority_value(examples);
    } else {
        var _ret = function () {
            var _choose_attribute = choose_attribute(attribs, examples);

            var _choose_attribute2 = _slicedToArray(_choose_attribute, 2);

            var best_attrib = _choose_attribute2[0];
            var best_values = _choose_attribute2[1];
            var tree = {};
            var m = majority_value(examples);
            tree[attrib_strs[best_attrib]] = {};
            return {
                v: best_values.reduce(function (tree, v_i) {
                    var examples_i = examples.filter(function (example) {
                        return example[best_attrib] === v_i;
                    }),
                        attribs_i = attribs.filter(function (_, idx) {
                        return idx !== +best_attrib;
                    }),
                        subtree = decision_tree_learning(examples_i, attribs_i, attrib_strs, m);
                    tree[attrib_strs[best_attrib]][v_i] = subtree;
                    return tree;
                }, tree)
            };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
    }
}

function majority_value(examples) {
    return examples.map(function (example) {
        return example.slice(-1)[0];
    }).reduce(function (acc, cur, idx) {
        acc[cur] ? acc[cur]++ : acc[cur] = 1;
        if (acc[cur] > acc['__max'][0]) acc['__max'] = [acc[cur], cur];
        return acc;
    }, { '__max': [0, null] })['__max'][1];
}

function choose_attribute(attribs, examples) {
    return attribs.map(function (attribute) {
        return [attribute, distinct(examples.map(function (example) {
            return example[attribute];
        }))];
    }).map(function (A) {
        return [A, gain(A, examples)];
    }).reduce(function (acc, cur, idx) {
        return cur[1] > acc[1] ? cur : acc;
    }, [[], -1])[0];
}

function distinct(values) {
    return Object.keys(values.reduce(function (acc, cur) {
        acc[cur] = true;
        return acc;
    }, {}));
}

function split_pn(examples) {
    var positive = arguments.length <= 1 || arguments[1] === undefined ? "true" : arguments[1];

    var p = examples.filter(function (example) {
        return example.slice(-1)[0] === positive;
    }).length,
        n = examples.length - p;
    return [p, n];
}

function I(P) {
    return P.filter(function (v_i) {
        return v_i > 0;
    }).map(function (v_i) {
        return -v_i * Math.log2(v_i);
    }).reduce(function (a, b) {
        return a + b;
    }, 0);
}

function remainder(A, examples) {
    var _split_pn = split_pn(examples);

    var _split_pn2 = _slicedToArray(_split_pn, 2);

    var p = _split_pn2[0];
    var n = _split_pn2[1];

    return A[1].reduce(function (prev, cur) {
        var examples_cur = examples.filter(function (example) {
            return example[A[0]] === cur;
        });

        var _split_pn3 = split_pn(examples_cur);

        var _split_pn4 = _slicedToArray(_split_pn3, 2);

        var p_i = _split_pn4[0];
        var n_i = _split_pn4[1];

        if (examples_cur.length === 0) {
            return prev + 0;
        } else {
            return prev + (p_i + n_i) / (p + n) * I([p_i / (p_i + n_i), n_i / (p_i + n_i)]);
        }
    }, 0);
}

function gain(A, examples) {
    var _split_pn5 = split_pn(examples);

    var _split_pn6 = _slicedToArray(_split_pn5, 2);

    var p = _split_pn6[0];
    var n = _split_pn6[1];

    return I([p / (p + n), n / (p + n)]) - remainder(A, examples);
}

var tree_data = decision_tree_learning(examples, attribs, attrib_strs, false);

