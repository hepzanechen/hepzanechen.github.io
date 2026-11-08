"""Small diagnostic of installed Triton timers; not a framework speed ranking.
Run on a supported GPU: python gpu_timer_diagnostic.py > gpu-timer-result.json
"""
import contextlib
import hashlib
import inspect
import json
import statistics
import time
import torch
import triton
from triton.testing import do_bench, do_bench_cudagraph

torch.manual_seed(20261109)
a = torch.randn(1024 * 1024, device='cuda', dtype=torch.float32)
b = torch.randn_like(a)
out = torch.empty_like(a)
fn = lambda: torch.add(a, b, out=out)
fn()
torch.cuda.synchronize()
torch.testing.assert_close(out.cpu(), a.cpu() + b.cpu(), rtol=0, atol=0)

def identity(f):
    source = inspect.getsource(f)
    return {'signature': str(inspect.signature(f)),
            'source_sha256': hashlib.sha256(source.encode()).hexdigest()}

rows = []
for sweep, order in enumerate([['event', 'graph'], ['graph', 'event'], ['event', 'graph']]):
    for mode in order:
        kwargs = {'rep': 20, 'return_mode': 'median'}
        timer = do_bench if mode == 'event' else do_bench_cudagraph
        if mode == 'event':
            kwargs['warmup'] = 5
        start = time.perf_counter()
        if mode == 'graph':
            side_stream = torch.cuda.Stream()
            side_stream.wait_stream(torch.cuda.current_stream())
            context = torch.cuda.stream(side_stream)
        else:
            context = contextlib.nullcontext()
        with context:
            value = timer(fn, **kwargs)
        torch.cuda.synchronize()
        rows.append({'sweep': sweep, 'mode': mode, 'kwargs': kwargs,
                     'median_ms': float(value),
                     'timer_wall_seconds': time.perf_counter() - start})
print(json.dumps({'purpose': 'installed-timer diagnostic; not a controlled framework comparison',
                  'torch': torch.__version__, 'triton': triton.__version__,
                  'device': torch.cuda.get_device_name(0),
                  'visible_memory_bytes': torch.cuda.get_device_properties(0).total_memory,
                  'workload': {'op': 'torch.add', 'elements': 1048576,
                               'dtype': 'float32', 'preallocated_output': True},
                  'correctness': 'exact CPU comparison passed',
                  'timers': {'event': identity(do_bench), 'graph': identity(do_bench_cudagraph)},
                  'samples': rows,
                  'limitations': ['Only three alternating sweeps',
                                  'Different timer cache and sampling semantics',
                                  'No FlagGems/Helion speed comparison',
                                  'Does not establish historical compiler-wheel behavior']}, indent=2))
