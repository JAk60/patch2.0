import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const patches = [
    {
        file: 'node_modules/immer/dist/immer.mjs',
        find: /Find the full error at: https:/g,
        replace: 'Find the full error at: https://immerjs.github.io/immer/errors'
    },
    {
        file: 'node_modules/immer/dist/immer.cjs.production.min.js',
        find: /Find the full error at: https:/g,
        replace: 'Find the full error at: https://immerjs.github.io/immer/errors'
    },
    {
        file: 'node_modules/@react-dnd/invariant/dist/index.mjs',
        find: /Read more: http:/g,
        replace: 'Read more: https://react-dnd.github.io/react-dnd/docs'
    },
    {
        file: 'node_modules/react-dnd/dist/esm/common/DragSourceMonitorImpl.js',
        find: /Read more: http:/g,
        replace: 'Read more: https://react-dnd.github.io/react-dnd/docs'
    },
    {
        file: 'node_modules/react-dnd/dist/esm/common/DropTargetMonitorImpl.js',
        find: /Read more: http:/g,
        replace: 'Read more: https://react-dnd.github.io/react-dnd/docs'
    },
    {
        file: 'node_modules/react-dnd/dist/esm/decorators/decorateHandler.js',
        find: /Read more: http:/g,
        replace: 'Read more: https://react-dnd.github.io/react-dnd/docs'
    }
];

// Also scan entire react-dnd directory for any file with the pattern
function scanAndPatchDirectory(dir, pattern, replacement) {
    try {
        const files = readdirSync(dir, { withFileTypes: true });

        for (const file of files) {
            const fullPath = join(dir, file.name);

            if (file.isDirectory()) {
                scanAndPatchDirectory(fullPath, pattern, replacement);
            } else if (file.name.endsWith('.js') || file.name.endsWith('.mjs')) {
                try {
                    const content = readFileSync(fullPath, 'utf8');
                    if (pattern.test(content)) {
                        const fixed = content.replace(pattern, replacement);
                        writeFileSync(fullPath, fixed, 'utf8');
                        console.log(`✓ Patched: ${fullPath}`);
                    }
                } catch (err) {
                    // Skip files that can't be read
                }
            }
        }
    } catch (err) {
        // Skip directories that can't be accessed
    }
}

console.log('Patching library files...\n');

// Apply specific patches
for (const patch of patches) {
    const filePath = resolve(__dirname, '..', patch.file);
    try {
        let content = readFileSync(filePath, 'utf8');
        if (patch.find.test(content)) {
            content = content.replace(patch.find, patch.replace);
            writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Patched: ${patch.file}`);
        }
    } catch (error) {
        console.warn(`⚠ Could not patch ${patch.file}:`, error.message);
    }
}

// Scan entire react-dnd directory
console.log('\nScanning react-dnd directory...');
scanAndPatchDirectory(
    resolve(__dirname, '../node_modules/react-dnd'),
    /Read more: http:/g,
    'Read more: https://react-dnd.github.io/react-dnd/docs'
);

// Scan react-sortable-tree's nested react-dnd
console.log('\nScanning react-sortable-tree dependencies...');
scanAndPatchDirectory(
    resolve(__dirname, '../node_modules/react-sortable-tree/node_modules'),
    /Read more: http:/g,
    'Read more: https://react-dnd.github.io/react-dnd/docs'
);

console.log('\n✅ All patches complete!');