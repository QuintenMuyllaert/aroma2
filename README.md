# Aroma

Aroma is a Lua-based WebAssembly graphics runtime with a simple API for creating interactive 2D graphics. Code is executed by a Lua 5.2 interpreter compiled to WebAssembly. The runtime is implemented in C and renders through WebGL via Emscripten.

Aroma provides a `aroma.*` API and includes a `love.*` alias for compatibility with Love2D-style code.

## Prerequisites

- [Emscripten SDK](https://emscripten.org) with `emcc` and `emrun` available (Arch package installs them under `/usr/lib/emscripten`).
- [Node.js](https://nodejs.org/) with `esbuild` installed (`npm install --save-dev esbuild`).

## Build

```sh
make
```

The `Makefile` performs three steps:

1. Compiles Lua + the engine to modular ES-module output (`dist/index.js`, `index.wasm`, `index.data`).
2. Bundles the browser entry point (`js/module-init.js`) and helper modules with esbuild into `dist/app.js`.
3. Copies `shell.html` into `dist/index.html` (the page that loads `app.js`).

## Run

```sh
make run
```

Emscripten's `emrun` starts a local web server that serves the page. Open the printed URL to see the spinning triangle and the asynchronously loaded texture.

You can use any other static file server if you prefer:

```sh
python3 -m http.server --directory dist 8080
```

## Project Layout

- `main.c` — engine glue: embeds Lua 5.2, exposes the `aroma.graphics` API (with `love.*` compatibility alias), and drives the render loop.
- `lua-5.2/` — vanilla Lua 5.2 source used to build the interpreter.
- `js/` — modern JS helpers (texture-store, module bootstrap) that are bundled with esbuild.
- `Makefile` — orchestrates both the wasm build and the JS bundle.
- `shell.html` — HTML wrapper with code editor and canvas, copied to `dist/index.html`.
