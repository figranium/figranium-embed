import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const presetRaw = JSON.parse(readFileSync(process.env.PRESET_FILE, 'utf8'));
const configuration = typeof presetRaw.configuration === 'string'
  ? JSON.parse(presetRaw.configuration)
  : presetRaw.configuration;
const task = configuration?.tasks?.[0] ?? configuration;

if (!task || !Array.isArray(task.actions)) throw new Error('Preset did not contain a renderable task.');

mkdirSync('verification', { recursive: true });
mkdirSync('assets', { recursive: true });
const serializedTask = JSON.stringify(task).replace(/<\/script/gi, '<\\/script');

writeFileSync('verification/embed-test.html', `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
html,body{margin:0;background:#0b0b0b}body{padding:28px;box-sizing:border-box}#frame{width:1384px;height:780px;margin:0 auto;overflow:hidden;border-radius:16px;background:#020202}
</style></head><body><div id="frame"><div id="embed"></div></div><script type="module">
import { mountFigraniumEmbed } from '/dist/index.js';
window.embedController = mountFigraniumEmbed('#embed',{task:${serializedTask},height:780,autoResize:false,title:'Google Maps Lead Scraper'});
</script></body></html>`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4173/verification/embed-test.html', { waitUntil: 'networkidle' });
const iframeHandle = await page.waitForSelector('#embed iframe');
const frame = await iframeHandle.contentFrame();
if (!frame) throw new Error('Could not access generated iframe.');
await frame.waitForSelector('.figranium-embed');

await frame.waitForFunction(() => Boolean(document.querySelector('style[data-figranium-live="true"]')), null, { timeout: 10000 });

const flexDisplay = await frame.locator('.flex').first().evaluate((el) => getComputedStyle(el).display);
if (flexDisplay !== 'flex') throw new Error(`Tailwind utilities are not active: .flex computed ${flexDisplay}`);

const modalSelector = '[role="dialog"], dialog[open], .modal, [data-modal="true"]';
const before = await frame.locator(modalSelector).count();
const box = await iframeHandle.boundingBox();
if (!box) throw new Error('Iframe had no visible bounding box.');
await page.mouse.click(box.x + Math.min(420, box.width / 2), box.y + Math.min(260, box.height / 2));
await page.waitForTimeout(250);
const after = await frame.locator(modalSelector).count();
if (after !== before) throw new Error(`Read-only embed opened a modal (${before} -> ${after}).`);

const bodyText = await frame.locator('body').innerText();
if (!/Google Maps|Lead Scraper/i.test(bodyText)) throw new Error('Expected task text was not rendered.');

await page.locator('#frame').screenshot({ path: 'assets/google-maps-leads-scraper.png' });
console.log(JSON.stringify({presetTitle:presetRaw.title,taskName:task.name,actions:task.actions.length,liveStyles:true,tailwindFlex:flexDisplay,modalCountBefore:before,modalCountAfter:after,screenshot:'assets/google-maps-leads-scraper.png'}, null, 2));
await browser.close();
