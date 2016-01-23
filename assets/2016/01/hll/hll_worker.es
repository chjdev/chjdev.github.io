importScripts('hll.js');

self.addEventListener('message', function(e) {
    const [std_error, visitors, debug_step, do_gold] = e.data;
    
    function next_visitor(visitors) {
        return Math.floor(Math.random() * visitors);
    }
    
    const gold = {},
          log_log = HyperLogLog(std_error);
    
    const start = new Date().getTime();
    for (var i = 0, d = 0; i < 50000000; ++i, ++d) {
        const visitor = next_visitor(visitors);
        if (do_gold) {
            gold[visitor] = true;
        }
        log_log.add(visitor);
        if (d >= debug_step) {
            d = 0;
            const estimated = log_log.count(),
                  actual = Object.keys(gold).length,
                  step = new Date().getTime(),
                  throughput = i / (step - start) * 1000;
            self.postMessage([i, estimated, actual, throughput]);
        }
    }
}, false);


