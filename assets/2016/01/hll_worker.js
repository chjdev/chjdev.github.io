importScripts('hll.js');

self.addEventListener('message', function(e) {
    const visitors =   4000000,
          debug_step =   10000;
    
    function next_visitor(visitors) {
        return Math.floor(Math.random() * visitors);
    }
    
    const gold = {},
          log_log = HyperLogLog(0.04);
    
    const start = new Date().getTime();
    for (var i = 0; i < 50000000; ++i) {
        var visitor = next_visitor(visitors);
        gold[visitor] = true;
        log_log.add(visitor);
        if (i%debug_step === 0) {
            const estimated = log_log.count(),
                  actual = Object.keys(gold).length,
                  step = new Date().getTime(),
                  throughput = i / (step - start) * 1000; // bit different
//            console.log(i, estimated, actual, (-100 + 100 * (actual / estimated)));
            self.postMessage([i, estimated, actual, throughput]);
        }
    }
    const end = new Date().getTime();
    console.log("took", end - start);

}, false);


