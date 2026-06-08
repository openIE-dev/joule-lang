# energy-budget

A function with a `@energy(< 100pJ)` budget annotation and a caller with `@energy(< 50nJ)`.

```bash
joulec build add_one.joule --check-budgets
./add_one
```

What this shows:
- Per-function `@energy(< N{p|n|u}J)` annotation
- Compile-time budget enforcement
- Budget propagation through call sites

## What happens on budget violation

If measured per-op energy cost (from the substrate-energy data table) exceeds the budget, `joulec` fails to build and prints the violation site:

```
error: function `add_one` exceeds energy budget
   --> add_one.joule:2:1
    | declared: < 100 pJ
    | measured: 142 pJ on apple-silicon-m4
    | overage:  +42 pJ (+42%)
```
