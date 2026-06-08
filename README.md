# Joule

**A self-hosted programming language with compile-time energy budgets.**

[![Release](https://github.com/openIE-dev/joule-lang/actions/workflows/release.yml/badge.svg)](https://github.com/openIE-dev/joule-lang/actions/workflows/release.yml)
[![Quality](https://github.com/openIE-dev/joule-lang/actions/workflows/quality.yml/badge.svg)](https://github.com/openIE-dev/joule-lang/actions/workflows/quality.yml)
[![Docs](https://github.com/openIE-dev/joule-lang/actions/workflows/docs.yml/badge.svg)](https://openie-dev.github.io/joule-lang)
[![crates.io](https://img.shields.io/crates/v/joulec.svg)](https://crates.io/crates/joulec)
[![License](https://img.shields.io/badge/license-BSL--1.1-blue.svg)](./LICENSE)


Joule is the world's first energy-aware programming language with first-class compile-time energy budget enforcement. Every function has an energy cost. Every accelerator is measured. Every decision is accountable. The Joule self-host bootstraps from a small kernel and lowers through HIR to native (C / Cranelift / LLVM / MLIR / CUDA), WASM, and [flowG](https://github.com/openIE-dev/flow-g).

This is the **public release surface**. Source is private at [`openIE-dev/joule-lang-core`](https://github.com/openIE-dev/joule-lang-core) — a 161-crate nested workspace including the self-host bootstrap, codegen passes, runtime, edge tooling, and the joule cascade.

## Status

> Release binaries + examples + documentation. Joule is **free to use software**, not an open-source project. See [LICENSE](./LICENSE) for Business Source License 1.1 terms — converts to Apache-2.0 four years after each binary's release date.

## What you get

| Binary | Purpose |
|---|---|
| `joulec` | The Joule compiler: parse, type-check, codegen to native / WASM / flowG |
| `joule-serve` | HTTP server for running Joule programs with energy receipts |

Plus a Rust library, [`joulec`](https://crates.io/crates/joulec), for embedding.

## Install

```bash
# via cargo
cargo install joulec

# via cargo-binstall (prebuilt binary)
cargo binstall joulec

# direct download
curl -fsSL https://github.com/openIE-dev/joule-lang/releases/latest/download/joulec-$(uname -s)-$(uname -m).tar.gz | tar xz
```

Platform support:

| Platform | Status |
|---|---|
| macOS arm64 (Apple Silicon) | shipping |
| macOS x86_64 | shipping |
| Linux x86_64 (musl) | shipping |
| Linux aarch64 (musl) | shipping |
| Windows x86_64 | shipping |

## Hello, Joule

```joule
fn add_one(x: f64) -> f64
    @energy(< 100pJ)
:
    x + 1.0

fn main():
    let r = add_one(41.0)
    println(r)
```

```bash
joulec build examples/hello/add_one.joule
./add_one
```

Energy receipts:

```bash
joulec build examples/hello/add_one.joule --record-energy receipt.json
cat receipt.json | jq '.functions[] | {name, budget_pj, measured_pj}'
```

See [`examples/`](./examples/) for hello world, multi-backend codegen, the bootstrap walkthrough, and the joule → flowG bridge.

## What makes Joule different

- **Compile-time energy budgets** — `@energy(< 100pJ)` annotations are enforced by the compiler against measured per-op cost data. Budget violations fail to build.
- **Self-hosted bootstrap** — the Joule compiler is written in Joule. The bootstrap C emitter starts from a small kernel and grows out. You can audit the self-host trace.
- **Multi-backend codegen** — same `.joule` file can lower to C, Cranelift, LLVM, MLIR, CUDA, WebAssembly, or flowG. Choose your target by use case; the energy budget tracks across backends.
- **Joule cascade** — at runtime, Joule programs participate in a 16-level cascade (L0–L10) that escalates from cache → lawful synthesizer → small models → frontier as needed.
- **Edge-ready** — Joule binaries are small enough to ship to drones, microcontrollers, OpenMV cameras, and other embedded targets.

## How it fits

Joule is the **energy-budgeted compiled surface** in the openIE-dev family:

- [flowG](https://github.com/openIE-dev/flow-g) — the substrate Joule lowers to
- [Lux](https://github.com/openIE-dev/lux-lang) — reactive, app-oriented sibling
- [JMax](https://github.com/openIE-dev/jmax) — math-native sibling
- [JouleDB](https://github.com/openIE-dev/jouledb) — the metered database that Joule programs persist to

## Documentation

- Getting started → <https://openie-dev.github.io/joule-lang>
- Examples → [`examples/`](./examples/)
- Language reference → <https://openie-dev.github.io/joule-lang/reference>
- Bootstrap walkthrough → <https://openie-dev.github.io/joule-lang/bootstrap>
- Source mirror → [`openIE-dev/joule-lang-core`](https://github.com/openIE-dev/joule-lang-core)

## Releases

[GitHub Releases](https://github.com/openIE-dev/joule-lang/releases) — tagged versions with prebuilt binaries for every supported platform, plus SHA-256 checksums.

## Community

- [Discussions](https://github.com/openIE-dev/joule-lang/discussions) — Q&A, language design
- [Issues](https://github.com/openIE-dev/joule-lang/issues) — bug reports
- Security: see [SECURITY.md](./SECURITY.md)

## License

- **Binaries** — Business Source License 1.1; see [LICENSE](./LICENSE). Free for non-commercial use, internal use by orgs under $1M revenue, security/academic research. Converts to Apache-2.0 four years after each release.
- **Documentation** — CC-BY-4.0
- **Examples** — Apache-2.0
