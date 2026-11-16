// Assemble the unpacked extension in build/extension from the web app sources.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ext = dirname(fileURLToPath(import.meta.url));
const root = join(ext, '..');
const out = join(root, 'build', 'extension');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const dir of ['css', 'js', 'images'])
    cpSync(join(root, dir), join(out, dir), { recursive: true });
for (const file of ['manifest.json', 'background.js', 'redgifs-sound.js'])
    cpSync(join(ext, file), join(out, file));
cpSync(join(ext, 'vendor', 'jquery-3.6.1.min.js'), join(out, 'js', 'jquery-3.6.1.min.js'));

// MV3 extension pages may only load scripts packaged with the extension.
const jqueryCdn = '<script type="text/javascript" src="https://code.jquery.com/jquery-3.6.1.js"></script>';
const html = readFileSync(join(root, 'index.html'), 'utf8');
if (!html.includes(jqueryCdn))
    throw new Error('jQuery <script> tag not found in index.html, update build.mjs');
writeFileSync(join(out, 'index.html'),
    html.replace(jqueryCdn, '<script type="text/javascript" src="js/jquery-3.6.1.min.js"></script>'));

console.log('Extension built in ' + out);
