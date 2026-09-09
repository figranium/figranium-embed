import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), '.tmp-iframe');
let html = readFileSync(resolve(root, 'iframe.internal.html'), 'utf8');

html = html.replace(/<link[^>]+href="\.\/(assets\/[^\"]+\.css)"[^>]*>/g, (_, path) => {
  const css = readFileSync(resolve(root, path), 'utf8');
  return `<style>${css}</style>`;
});

html = html.replace(/<script[^>]+src="\.\/(assets\/[^\"]+\.js)"[^>]*><\/script>/g, (_, path) => {
  const js = readFileSync(resolve(root, path), 'utf8').replace(/<\/script/gi, '<\\/script');
  return `<script type="module">${js}</script>`;
});

writeFileSync(
  resolve('src/generatedIframeDocument.ts'),
  `// Generated at build time from canonical Figranium UI. Do not edit.\nexport const GENERATED_IFRAME_DOCUMENT = ${JSON.stringify(html)};\n`,
);

rmSync(root, { recursive: true, force: true });
