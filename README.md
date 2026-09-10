# Figranium Embed

Read-only Figranium task rendering inside a real iframe, with **no server and no hosted embed URL**.

![Google Maps Leads Scraper rendered with Figranium Embed](./assets/google-maps-leads-scraper.png)

The screenshot above is captured from the real zero-host iframe using the **Google Maps Lead Scraper** preset from Figranium Templates Hub.

Figranium Embed is primarily infrastructure for Figranium Templates Hub. The repository is public, but it is currently intended to be **built from source rather than installed as a published package**.

Embed creates an iframe with `srcdoc`, loads Figranium's canonical read-only UI inside it, and passes task JSON through a small internal `postMessage` protocol.

## Build from source

Clone the repository and build it locally:

```bash
git clone https://github.com/figranium/figranium-embed.git
cd figranium-embed
npm install
npm run build
```

The build flow syncs current Figranium, compiles its read-only UI into a temporary standalone document, inlines that document into the Embed build, deletes the temporary site output, then builds the final library.

There is no embed domain to configure, deploy, or keep online.

## Embed a task

After building, use the generated library from your application. The primary API mounts the iframe into a target element:

```js
import { mountFigraniumEmbed } from './path/to/figranium-embed/dist/index.js';

const embed = mountFigraniumEmbed('#figranium-task', {
  task,
  height: 600,
});
```

The returned controller can replace the rendered task or remove the iframe:

```js
embed.setTask(nextTask);
embed.destroy();
```

## What the iframe can do

It renders only what already exists in the task. The canvas is navigable: users can drag it or use a mouse wheel/trackpad to pan around larger tasks. Task labels and summaries remain visible while editor-only add, settings, and tune controls are hidden.

It cannot edit or move blocks and sticky notes, open configuration modals, add actions, save, run tasks, open the browser, use the selector picker, authenticate, or persist anything.

The iframe is sandboxed with scripts enabled and receives task data only from the page that created it.

## Why the UI stays in sync

This repository does **not** maintain a copied Figranium editor. Before each build, it clones `figranium/figranium` and builds the iframe document from Figranium's canonical `src/embed` entrypoint and stylesheet.

At runtime, the iframe prefers the latest **compiled** canonical Figranium stylesheet published automatically from `figranium/figranium` UI changes. If that stylesheet is unavailable, invalid, blocked, or the user is offline, Embed keeps using the fully compiled stylesheet bundled into the build. There is still no hosted iframe endpoint.

For deterministic/offline-only rendering, disable the live stylesheet check:

```js
mountFigraniumEmbed('#figranium-task', {
  task,
  preferBundled: true,
});
```

Figranium exposes a purpose-built `ReadOnlyCanvas`, so Embed does not depend on the editor's internal prop surface. CI also rebuilds against current Figranium so incompatible upstream UI changes fail instead of silently drifting.

`FIGRANIUM_REF` can pin a build to a specific Figranium branch or tag; builds default to `main`.

## React

React is optional and is not required for the primary iframe API. React applications can use the secondary entrypoint from the built source:

```tsx
import { FigraniumEmbed } from './path/to/figranium-embed/dist/react.js';
import './path/to/figranium-embed/dist/style.css';

export function Preview({ task }) {
  return <FigraniumEmbed task={task} height={600} />;
}
```

## License

Apache-2.0
