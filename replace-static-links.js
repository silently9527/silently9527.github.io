import fs from 'fs';
import path from 'path';

const DIST_DIR = path.join(process.cwd(), 'docs/.vitepress/dist');
const BASE_URL = 'https://cdn.jsdelivr.net/gh/silently9527/silently9527.github.io@pages/';

function replaceLinks(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/"\/assets\//g, `"${BASE_URL}assets/`);
    content = content.replace(/\(\/assets\//g, `(${BASE_URL}assets/`);
    fs.writeFileSync(filePath, content, 'utf-8');
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseDir(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
            replaceLinks(fullPath);
        }
    });
}

traverseDir(DIST_DIR);
console.log('Static links replaced with jsDelivr CDN links.');
