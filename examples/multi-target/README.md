# multi-target

The same `.joule` file compiled to four backends. Each backend produces a different binary; energy budgets are checked against the target-specific cost data.

```bash
# Native (via Cranelift)
joulec build add_one.joule --target cranelift -o add_one_cl

# C source emission
joulec build add_one.joule --target c -o add_one.c

# LLVM IR
joulec build add_one.joule --target llvm -o add_one.ll

# Lower to flowG FunctionGraph
joulec build add_one.joule --target flowg -o add_one.fg
```

What this shows:
- The `--target` flag
- The four supported lowering paths: C, Cranelift, LLVM, flowG
- Per-target energy cost tables (different on x86_64 vs Apple Silicon vs ARM Cortex-M)

## Inspecting flowG output

```bash
flowg emit --target wgsl add_one.fg
```

The Joule frontend's output `.fg` is a regular flowG FunctionGraph; flow-g tools (emit, run, bench) all work on it.
