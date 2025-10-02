# WebGL Spinning Triangle (Lua)

Minimal Love2D-style scene driven from `main.lua`, executed by a Lua 5.2 interpreter compiled to WebAssembly. The runtime is implemented in C, talks to Lua through a tiny subset of the Love2D graphics API, and renders through WebGL via Emscripten.

## Prerequisites

- [Emscripten SDK](https://emscripten.org) with `emcc` and `emrun` available (Arch package installs them under `/usr/lib/emscripten`).

## Build

```sh
make
```

The target emits into `dist/` (`index.html`, `index.js`, `index.wasm` plus the preloaded `main.lua`).

## Run

```sh
make run
```

Emscripten's `emrun` starts a local web server that serves the page. Open the printed URL to see the spinning triangle.

You can use any other static file server if you prefer:

```sh
python3 -m http.server --directory dist 8080
```

## Project Layout

- `main.c` — engine glue: embeds Lua 5.2, exposes minimal `love.graphics` functions, and drives the render loop.
- `lua-5.2/` — vanilla Lua 5.2 source used to build the interpreter.
- `main.lua` — Love2D-style script that defines `love.load`, `love.update`, and `love.draw` for the spinning triangle.
- `Makefile` — builds the WASM module, preloads `main.lua`, and produces the WebGL-ready output in `dist/`.
- `shell.html` — tiny HTML wrapper that defines the `<canvas>` the runtime renders into.
