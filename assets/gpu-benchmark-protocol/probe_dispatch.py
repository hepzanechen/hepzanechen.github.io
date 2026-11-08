"""CPU-only wrapper argument probe. No GPU timings are produced.

Usage: python probe_dispatch.py /path/to/FlagTree
Reference revision: 2dc31aecc883ab04c8f7a1c1dab8b321ae8ed109
Run in a disposable process: this script installs stub triton modules.
"""
import importlib.util
import json
import sys
import types
from pathlib import Path

source = Path(sys.argv[1]) / 'python/triton/flagtune/runtime/benchmark_protocol.py'
for name in ['triton', 'triton.runtime', 'triton.runtime.driver', 'triton.testing']:
    sys.modules[name] = types.ModuleType(name)
Active = type('Active', (), {'__module__': 'triton.backends.metax.driver'})
sys.modules['triton.runtime.driver'].driver = types.SimpleNamespace(active=Active())
calls = []
def timer(fn, rep=20, quantiles=None, return_mode='mean', n_retries=10):
    calls.append(dict(rep=rep, quantiles=quantiles, n_retries=n_retries))
    return [1.0, 1.0, 1.0]  # sentinel values only; never performance results
sys.modules['triton.testing'].do_bench_cudagraph = timer
spec = importlib.util.spec_from_file_location('protocol_probe', source)
module = importlib.util.module_from_spec(spec)
sys.modules[spec.name] = module
spec.loader.exec_module(module)
resolved = module.resolve_benchmarker('replay', warmup_ms=25,
                                      measurement_ms=100, n_retries=10)
resolved.benchmark(lambda: None, [0.5, 0.2, 0.8])
assert calls == [dict(rep=10.0, quantiles=[0.5, 0.2, 0.8], n_retries=10)]
print(json.dumps({'recorded_protocol': resolved.protocol.as_dict(),
                  'timer_received': calls,
                  'scope': 'argument forwarding only; stub timer, no GPU execution'}, indent=2))
