// strip-timestamps.js
const fs = require('fs');
const path = require('path');

function stripTimestamps(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove timestamp patterns
  content = content.replace(/new Date\([^)]*\)/g, 'null');
  content = content.replace(/\.created\s*=\s*new Date/g, '.created=null');
  content = content.replace(/created:\s*new Date/g, 'created:null');
  content = content.replace(/Date\.now\(\)/g, '0');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Stripped timestamps from: ${filePath}`);
}

// Process all JS files in build directory
const buildDir = './build';
const jsFiles = [];

function findJSFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findJSFiles(filePath);
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  });
}

findJSFiles(buildDir);
jsFiles.forEach(stripTimestamps);