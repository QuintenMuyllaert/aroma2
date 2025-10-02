import wasmAromaModule from './wasm-aroma.js';
import { createTextureStore } from './texture-store.js';

const canvas = document.getElementById('canvas');
if (!canvas) {
  throw new Error('missing #canvas element');
}

const codeEditor = document.getElementById('code-editor');
const runButton = document.getElementById('run-button');

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

wasmAromaModule(moduleConfig).then((Module) => {
  console.log('Aroma WASM module loaded successfully');

  const runCode = () => {
    const code = codeEditor.value;
    try {
      const result = Module.ccall(
        'run_lua_code',
        'number',
        ['string'],
        [code]
      );
      if (result !== 0) {
        console.error('Failed to run Lua code');
      }
    } catch (err) {
      console.error('Error running Lua code:', err);
    }
  };

  runButton.addEventListener('click', runCode);

  codeEditor.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  });

  runButton.disabled = false;
}).catch((err) => {
  console.error('Failed to boot Aroma WASM runtime', err);
});
