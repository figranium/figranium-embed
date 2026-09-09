# Figranium Embed

Read-only, serverless Figranium task rendering built primarily for iframe embedding.

The iframe renders the canonical Figranium task canvas without editing, persistence, browser-opening, selector inspection, modals, or execution controls.

## Iframe embedding

Build and host `dist/iframe` as a static site. The root page is the embed endpoint.

```html
<iframe
  id="figranium-embed"
  src="https://embed.example.com/"
  style="width:100%;height:600px;border:0"
></iframe>

<script>
  const frame = document.getElementById('figranium-embed');

  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow) return;

    if (event.data?.type === 'figranium:embed:ready') {
      frame.contentWindow.postMessage({
        type: 'figranium:embed:set-task',
        version: 1,
        task
      }, '*');
    }

    if (event.data?.type === 'figranium:embed:resize') {
      frame.style.height = `${event.data.height}px`;
    }
  });
</script>
```

Protocol v1 messages:

- `figranium:embed:ready` — sent by the iframe when it is ready for task data.
- `figranium:embed:set-task` — sent by the parent with `{ version: 1, task }`.
- `figranium:embed:resize` — sent by the iframe with its current content height.

The iframe accepts task JSON only from its parent window and locks to the origin that sends the first valid task message.

## Why the UI stays in sync

This repository does **not** maintain a copied Figranium editor. Before every build, `scripts/sync-figranium.mjs` clones `figranium/figranium`, and both the iframe and React package import Figranium's canonical `src/embed` entrypoint and stylesheet directly.

Figranium itself exposes a purpose-built `ReadOnlyCanvas`, so internal editor prop changes do not become an Embed API contract. If an upstream Figranium UI change breaks Embed compatibility, CI fails instead of silently allowing the two interfaces to drift.

Set `FIGRANIUM_REF` to build against a specific Figranium branch or tag. It defaults to `main`.

## React package

The React package is secondary to the iframe endpoint.

```bash
npm install @figranium/embed
```

```tsx
import { FigraniumEmbed } from '@figranium/embed';
import '@figranium/embed/style.css';

export function Preview({ task }) {
  return <FigraniumEmbed task={task} height={600} />;
}
```

## Scope

Figranium Embed is intentionally display-only. It accepts task JSON and renders only the existing task using Figranium's real UI. It does not require a Figranium server and does not provide Run, Open Browser, the selector picker, editing, saving, authentication, persistence, or configuration modals.

## Development

```bash
npm install
npm run build
```

`npm run build` produces both the package build and `dist/iframe`, and automatically syncs the current canonical Figranium UI first.

## License

Apache-2.0
