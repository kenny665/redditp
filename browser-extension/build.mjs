// Assemble the unpacked extensions from the web app sources:
// build/extension (Chromium) and build/firefox-extension (Firefox).
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ext = dirname(fileURLToPath(import.meta.url));
const root = join(ext, '..');

// MV3 extension pages may only load scripts packaged with the extension.
// Keep vendor/jquery.min.js at the version index.html loads from the CDN.
const jqueryCdn = /<script type="text\/javascript" src="https:\/\/code\.jquery\.com\/jquery-[\d.]+(\.min)?\.js"><\/script>/;
const html = readFileSync(join(root, 'index.html'), 'utf8');
if (!jqueryCdn.test(html))
    throw new Error('jQuery <script> tag not found in index.html, update build.mjs');

const manifest = JSON.parse(readFileSync(join(ext, 'manifest.json'), 'utf8'));

const firefoxManifest = { ...manifest };
// Firefox runs MV3 background scripts as event pages, not service workers.
firefoxManifest.background = { scripts: ['background.js'] };
firefoxManifest.browser_specific_settings = {
    gecko: {
        id: 'redditp@kenny665.github.io',
        strict_min_version: '128.0',
        // Nothing is collected or sent anywhere but the browsed sites.
        data_collection_permissions: { required: ['none'] },
    },
};

const build = (name, targetManifest) => {
    const out = join(root, 'build', name);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(out, { recursive: true });

    for (const dir of ['css', 'js', 'images'])
        cpSync(join(root, dir), join(out, dir), { recursive: true });
    for (const file of ['background.js', 'redgifs-sound.js'])
        cpSync(join(ext, file), join(out, file));
    cpSync(join(ext, 'vendor', 'jquery.min.js'), join(out, 'js', 'jquery.min.js'));
    writeFileSync(join(out, 'manifest.json'), JSON.stringify(targetManifest, null, 2) + '\n');
    writeFileSync(join(out, 'index.html'),
        html.replace(jqueryCdn, '<script type="text/javascript" src="js/jquery.min.js"></script>'));

    console.log('Extension built in ' + out);
};

build('extension', manifest);
build('firefox-extension', firefoxManifest);
