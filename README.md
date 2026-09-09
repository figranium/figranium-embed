# Figranium Embed

Read-only, serverless Figranium task rendering for React.

`@figranium/embed` renders the canonical Figranium task canvas without exposing editing, persistence, browser-opening, selector inspection, or execution controls.

## Why the UI stays in sync

This repository does **not** maintain a copied Figranium editor. Before every build, `scripts/sync-figranium.mjs` clones `figranium/figranium` and the package imports Figranium's canonical `src/embed` entrypoint and stylesheet directly.

That means UI changes are sourced from Figranium itself. If an upstream Figranium UI change breaks Embed compatibility, CI fails instead of silently allowing the two interfaces to drift.

Set `FIGRANIUM_REF` to build against a specific Figranium branch or tag. It defaults to `main`.

## Install

```bash
npm install @figranium/embed
```

## Use

```tsx
import { FigraniumEmbed } from '@figranium/embed';
import '@figranium/embed/style.css';

export function Preview({ task }) {
  return <FigraniumEmbed task={task} height={600} />;
}
```

## Scope

Figranium Embed is intentionally display-only. It accepts task JSON and renders the task using Figranium's real UI. It does not require a Figranium server and does not provide Run, Open Browser, the selector picker, editing, saving, authentication, or persistence.

## Development

```bash
npm install
npm run build
```

The build automatically syncs the current canonical Figranium UI first.

## License

Apache-2.0
