OUT_DIR := dist
TARGET := $(OUT_DIR)/index.html
EMSCRIPTEN_ROOT := /usr/lib/emscripten
EMCC := $(EMSCRIPTEN_ROOT)/emcc
EMRUN := $(EMSCRIPTEN_ROOT)/emrun
EM_CACHE := $(abspath $(OUT_DIR)/.emscripten_cache)
SHELL_FILE := shell.html
LUA_DIR := lua-5.2/src
LUA_CORE := \
	lapi.c lcode.c lctype.c ldebug.c ldo.c ldump.c lfunc.c lgc.c llex.c \
	lmem.c lobject.c lopcodes.c lparser.c lstate.c lstring.c ltable.c \
	ltm.c lundump.c lvm.c lzio.c
LUA_LIB := \
	lauxlib.c lbaselib.c lbitlib.c lcorolib.c ldblib.c liolib.c lmathlib.c \
	loslib.c lstrlib.c ltablib.c loadlib.c linit.c
SOURCES := main.c $(addprefix $(LUA_DIR)/,$(LUA_CORE) $(LUA_LIB))

CFLAGS := -O3 -s WASM=1 -s FULL_ES2=1 -s MIN_WEBGL_VERSION=1 -s MAX_WEBGL_VERSION=1 \
          -s ENVIRONMENT=web -s ALLOW_MEMORY_GROWTH=0 -s ASSERTIONS=0 \
          -I$(LUA_DIR) --shell-file $(SHELL_FILE) --preload-file main.lua
LDFLAGS :=

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SOURCES) $(SHELL_FILE) main.lua | $(OUT_DIR)
	EM_CACHE=$(EM_CACHE) $(EMCC) $(SOURCES) $(CFLAGS) $(LDFLAGS) -o $@

$(OUT_DIR):
	mkdir -p $(OUT_DIR)

clean:
	rm -rf $(OUT_DIR)

run: all
	EM_CACHE=$(EM_CACHE) $(EMRUN) $(TARGET)
