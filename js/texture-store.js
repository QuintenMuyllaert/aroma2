export function createTextureStore(gl) {
  const textures = new Map();
  let nextId = 1;

  function createTextureFromBitmap(bitmap, opts = {}) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    const {
      flipY = true,
      mag = gl.NEAREST,
      min = gl.NEAREST,
      wrapS = gl.CLAMP_TO_EDGE,
      wrapT = gl.CLAMP_TO_EDGE,
    } = opts;

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, mag);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);

    const id = nextId++;
    textures.set(id, { tex, width: bitmap.width, height: bitmap.height });
    return { id, width: bitmap.width, height: bitmap.height };
  }

  async function load(url, opts) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    return createTextureFromBitmap(bitmap, opts);
  }

  function bind(id) {
    const entry = textures.get(id);
    if (!entry) return false;
    gl.bindTexture(gl.TEXTURE_2D, entry.tex);
    return true;
  }

  function release(id) {
    const entry = textures.get(id);
    if (!entry) return;
    gl.deleteTexture(entry.tex);
    textures.delete(id);
  }

  return {
    load,
    bind,
    release,
  };
}
