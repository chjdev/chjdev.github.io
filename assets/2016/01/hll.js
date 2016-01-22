// http://stackoverflow.com/a/6107232
const POW_2_32 = 0xFFFFFFFF + 1;

function HyperLogLog(std_error) {

    const m_sqrt = 1.04 / std_error,
          k = Math.ceil(log2(m_sqrt * m_sqrt)),
          k_comp = 32 - k,
          m = Math.pow(2, k),
          min_estimate = 5/2 * m,
          max_estimate = 1/30 * POW_2_32;
          alpha_m = m == 16 ? 0.673
              : m == 32 ? 0.697
              : m == 64 ? 0.709
              : 0.7213 / (1 + 1.079 / m),
          estimators = new Uint32Array(m);

    function log2(x) {
         return Math.log(x) / Math.LN2;
    }

    function add(value) {
        const hash = fnv1a(value.toString()),
              bucket = hash >>> k_comp;
        estimators[bucket] = Math.max(estimators[bucket], rank(hash, k_comp));
    }

    function fnv1a(text) {
         var hash = 2166136261;
         for (var i = 0; i < text.length; ++i) {
              hash ^= text.charCodeAt(i);
              hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
         }
         return hash >>> 0;
    }

    function rank(hash, max) {
        // counts from the back not the front, but doesn't matter!
        var r = 1;
        while ((hash & 1) == 0 && r <= max) { ++r; hash >>>= 1; }
        return r;
    }

    function count(hash) {
        function count_float() {
            const c = estimators.reduce((acc, estimate) => acc + 1 / Math.pow(2, estimate), 0);
            const E = alpha_m * m * m / c;
            if (E <= min_estimate) {
                const V = estimators.filter(estimate => estimate === 0).length > 0
                return V > 0 ? m * Math.log(m / V) : E; // linear counting
            } else if (E > max_estimate) {
                 return -POW_2_32 * Math.log(1 - E / POW_2_32);
            }
            return E;
        }
        return Math.floor(count_float());
    }

    return {count: count, add: add, rank: rank};
}
