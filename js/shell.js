import { initAroma } from './aroma.js';

// Get DOM elements
const canvas = document.getElementById('canvas');
const codeEditor = document.getElementById('code-editor');
const runButton = document.getElementById('run-button');
const exampleSelector = document.getElementById('example-selector');

if (!canvas) {
  throw new Error('missing #canvas element');
}

// Load example code from file
async function loadExample(filename) {
  try {
    const response = await fetch(`examples/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch example: ${response.status}`);
    }
    const code = await response.text();
    codeEditor.value = code;
  } catch (err) {
    console.error('Error loading example:', err);
    codeEditor.value = '-- Failed to load example\n';
  }
}

// Load default example on page load
loadExample('default.lua');

// Handle example selection change
exampleSelector.addEventListener('change', (e) => {
  loadExample(e.target.value);
});

// Initialize Aroma and set up UI handlers
initAroma(canvas).then((aroma) => {
  const runCode = () => {
    const code = codeEditor.value;
    try {
      aroma.runCode(code);
    } catch (err) {
      console.error('Failed to run code:', err);
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
