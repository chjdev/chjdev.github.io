'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

importScripts('hll.js');

self.addEventListener('message', function (e) {
    var _e$data = _slicedToArray(e.data, 4);

    var std_error = _e$data[0];
    var visitors = _e$data[1];
    var debug_step = _e$data[2];
    var do_gold = _e$data[3];

    function next_visitor(visitors) {
        return Math.floor(Math.random() * visitors);
    }

    var gold = {},
        log_log = HyperLogLog(std_error);

    var start = new Date().getTime();
    for (var i = 0, d = 0; i < 50000000; ++i, ++d) {
        var visitor = next_visitor(visitors);
        if (do_gold) {
            gold[visitor] = true;
        }
        log_log.add(visitor);
        if (d >= debug_step) {
            d = 0;
            var estimated = log_log.count(),
                actual = Object.keys(gold).length,
                step = new Date().getTime(),
                throughput = i / (step - start) * 1000;
            self.postMessage([i, estimated, actual, throughput]);
        }
    }
}, false);

