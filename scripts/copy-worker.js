// copy-worker.js

const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs');
const destination = path.join(__dirname, '..', 'public', 'pdf.worker.min.mjs');

// Ensure the public directory exists
fs.mkdirSync(path.dirname(destination), { recursive: true });

// Copy the file
fs.copyFileSync(source, destination);

console.log('Successfully copied pdf.worker.min.mjs to public directory.');
