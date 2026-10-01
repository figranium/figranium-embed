import { mountFigraniumEmbed } from './mount';

type Theme = 'light' | 'dark' | 'solarized-light' | 'solarized-dark';

function readTask(): unknown {
  const encoded = new URLSearchParams(window.location.search).get('task');
  if (!encoded) throw new Error('Missing task preview data.');

  const json = new TextDecoder().decode(
    Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0)),
  );
  return JSON.parse(json);
}

function readTheme(): Theme {
  const value = new URLSearchParams(window.location.search).get('theme');
  return value === 'light' || value === 'solarized-light' || value === 'solarized-dark' ? value : 'dark';
}

const host = document.querySelector<HTMLElement>('#figranium-task');
const message = document.querySelector<HTMLElement>('#figranium-embed-error');

if (!host || !message) throw new Error('Figranium Embed host elements are missing.');

try {
  mountFigraniumEmbed(host, {
    task: readTask() as never,
    theme: readTheme(),
    title: 'Figranium task preview',
    preferBundled: false,
  });
} catch (error) {
  host.hidden = true;
  message.hidden = false;
  message.textContent = error instanceof Error ? error.message : 'Unable to render this Figranium task.';
}
