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
cpSync(join(ext, 'vendor', 'jquery.min.js'), join(out, 'js', 'jquery.min.js'));

// MV3 extension pages may only load scripts packaged with the extension.
// Keep vendor/jquery.min.js at the version index.html loads from the CDN.
const jqueryCdn = /<script type="text\/javascript" src="https:\/\/code\.jquery\.com\/jquery-[\d.]+(\.min)?\.js"><\/script>/;
const html = readFileSync(join(root, 'index.html'), 'utf8');
if (!jqueryCdn.test(html))
    throw new Error('jQuery <script> tag not found in index.html, update build.mjs');
writeFileSync(join(out, 'index.html'),
    html.replace(jqueryCdn, '<script type="text/javascript" src="js/jquery.min.js"></script>'));

console.log('Extension built in ' + out);
