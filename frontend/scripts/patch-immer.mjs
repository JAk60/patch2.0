import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find and fix the truncated URL in immer
const immerPath = resolve(__dirname, '../node_modules/immer/dist/immer.mjs');

try {
    let content = readFileSync(immerPath, 'utf8');

    // Fix the incomplete URL
    content = content.replace(
        /Find the full error at: https:/g,
        'Find the full error at: https://immerjs.github.io/immer/errors'
    );

    writeFileSync(immerPath, content, 'utf8');
    console.log('✓ Patched immer.mjs successfully');
} catch (error) {
    console.warn('Could not patch immer:', error.message);
}