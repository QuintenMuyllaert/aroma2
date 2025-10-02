import wasmAromaModule from './wasm-aroma.js';
import { createTextureStore } from './texture-store.js';

/**
 * Initialize the Aroma WebAssembly runtime
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Promise<Object>} Promise that resolves with the initialized Aroma module
 */
export async function initAroma(canvas) {
  if (!canvas) {
    throw new Error('Canvas element is required');
  }

  const moduleConfig = {
    canvas,
    locateFile: (path) => `./${path}`,
  };

  let textureStore = null;

  function ensureTextureStore(Module) {
    if (!textureStore) {
      const gl = Module.ctx;
      if (!gl) {
        return null;
      }
      textureStore = createTextureStore(gl);
    }
    return textureStore;
  }

  moduleConfig.preRun = moduleConfig.preRun || [];
  moduleConfig.preRun.push((Module) => {
    Module.requestTextureLoad = (imagePtr, url) => {
      const attempt = () => {
        const store = ensureTextureStore(Module);
        if (!store) {
          setTimeout(attempt, 0);
          return;
        }
        store
          .load(url)
          .then(({ id, width, height }) => {
            Module._aroma_image_loaded(imagePtr, id, width, height);
          })
          .catch((err) => {
            console.error('Failed to load texture', url, err);
            Module._aroma_image_loaded(imagePtr, 0, 0, 0);
          });
      };

      attempt();
    };

    Module.bindTexture = (id) => {
      const store = ensureTextureStore(Module);
      if (!store || !store.bind(id)) {
        console.warn('Attempted to bind missing texture', id);
      }
    };

    Module.releaseTexture = (id) => {
      const store = ensureTextureStore(Module);
      if (store) {
        store.release(id);
      }
    };
  });

  const Module = await wasmAromaModule(moduleConfig);
  console.log('Aroma WASM module loaded successfully');

  return {
    module: Module,
    runCode: (code) => {
      try {
        const result = Module.ccall(
          'run_lua_code',
          'number',
          ['string'],
          [code]
        );
        if (result !== 0) {
          throw new Error('Lua code execution failed');
        }
        return true;
      } catch (err) {
        console.error('Error running Lua code:', err);
        throw err;
      }
    }
  };
}
