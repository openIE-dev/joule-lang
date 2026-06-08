# Install

`joulec` is published to crates.io and to GitHub Releases.

## Fastest: `cargo binstall`

```bash
cargo binstall joulec
```

`cargo-binstall` fetches the prebuilt binary for your platform from [GitHub Releases](https://github.com/openIE-dev/joule-lang/releases) without compiling anything.

If you don't have `cargo-binstall` yet:

```bash
cargo install cargo-binstall
```

## From source: `cargo install`

```bash
cargo install joulec
```

This compiles the source. Slower; useful if your platform isn't in our prebuilt list.

## Direct download

```bash
curl -fsSL -o joulec.tar.gz \
  https://github.com/openIE-dev/joule-lang/releases/latest/download/joulec-$(uname -s)-$(uname -m).tar.gz
tar xzf joulec.tar.gz
mv joulec-*/joulec /usr/local/bin/
```

## Verify

```bash
joulec --version
```
