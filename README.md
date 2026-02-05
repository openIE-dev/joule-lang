# Joule

**A systems programming language designed for energy-efficient computing.**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## Why Joule?

The global computing infrastructure now consumes approximately **4-5% of global electricity production**, with data centers alone using 240-340 TWh annually. Research shows that programming language choice can result in energy consumption differences of up to **75x** for equivalent computations.

Joule addresses this by making energy efficiency a first-class language concern, not an afterthought.

## Key Features

### Energy Awareness

```joule
@energy_budget(100.microjoules)
fn process_sensor_reading(data: &SensorData) -> ProcessedData {
    // Compiler estimates energy bounds; warns if budget may be exceeded
    ...
}
```

- **Energy budgets** as language primitives
- **Compile-time estimation** of energy consumption
- **Runtime measurement** via Intel RAPL, ARM Energy Probe

### Memory Safety Without Garbage Collection

Joule uses an ownership and borrowing system for deterministic memory management:

- No garbage collector pauses or energy spikes
- Memory safety verified at compile time
- Energy efficiency comparable to C/C++

### Heterogeneous Computing

First-class support for GPUs, TPUs, and AI accelerators:

```joule
@kernel
fn matrix_multiply(a: &Matrix, b: &Matrix) -> Matrix {
    // Implementation compiles for CPU, GPU, and TPU
    parallel_for (i, j) in (0..a.rows, 0..b.cols) {
        result[i][j] = dot(a.row(i), b.col(j))
    }
}
```

### Tri-Backend Compiler

| Backend | Use Case | Characteristics |
|---------|----------|-----------------|
| **Cranelift** | Development | Fast compilation for rapid iteration |
| **LLVM** | Production | Maximum optimization, broad platform support |
| **MLIR** | AI Hardware | TPUs, NPUs, emerging accelerators |

## Documentation

| Document | Description |
|----------|-------------|
| [The Joule Story](docs/the-joule-story.pdf) | Origins and motivation behind Joule |
| [Technical Overview](docs/technical-overview.pdf) | Language features and architecture |
| [Energy Crisis Whitepaper](docs/energy-crisis-computing-whitepaper.pdf) | Computing's energy footprint and solutions |
| [Sustainable Computing Manifesto](docs/sustainable-computing-manifesto.pdf) | Principles for energy-aware development |
| [AI-First Language Design with SSMs](docs/06-AI-First-Language-SSMs.pdf) | State Space Models for AI-native languages |

## Comparison with Rust

| Aspect | Rust | Joule |
|--------|------|-------|
| **Primary goal** | Memory safety | Energy efficiency |
| **Energy visibility** | External tools only | First-class (`@energy_budget`) |
| **Heterogeneous compute** | Via external libraries | First-class (`@kernel`, `@target(GPU)`) |
| **Hardware telemetry** | Manual integration | Built-in RAPL/thermal awareness |
| **Compiler backends** | LLVM only | Cranelift + LLVM + MLIR |

Rust remains excellent for safety-critical systems. Joule is designed for energy-critical systems where sustainability and hardware efficiency are primary concerns.

## Platform Support

### Tier 1 (Full support)
- Linux x86_64, arm64
- macOS x86_64, arm64 (Apple Silicon)
- Windows x86_64, arm64

### Tier 2 (Community-tested)
- FreeBSD x86_64
- WebAssembly (wasm32)

## Project Status

Joule is currently in early development. We are building the compiler infrastructure and core language features.

## Contributing

We welcome contributions from developers who share our vision of sustainable computing. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Joule is licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

## Links

- **Website**: [joule-lang.org](https://joule-lang.org)
- **Organization**: [Open Interface Engineering, Inc.](https://openie.dev)
- **Contact**: david@openie.dev

---

*"Every operation has a cost, and that cost matters."*

*Named after James Prescott Joule (1818-1889), who established the mechanical equivalent of heat and laid the foundation for the first law of thermodynamics.*
