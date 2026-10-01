import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { Task } from '@figranium-source/embed';
import { FigraniumEmbedSurface } from './FigraniumEmbedSurface';
import styles from './style.css?inline';

export type FigraniumEmbedTheme = 'light' | 'dark' | 'solarized-light' | 'solarized-dark';

export interface MountFigraniumEmbedCsrOptions {
  task: Task;
  theme?: FigraniumEmbedTheme;
  height?: number | string;
  className?: string;
  title?: string;
}

export interface FigraniumEmbedCsrController {
  setTask(task: Task): void;
  setTheme(theme: FigraniumEmbedTheme): void;
  destroy(): void;
}

/**
 * Mount a read-only Figranium task directly in the current page.
 *
 * The renderer runs client-side inside a Shadow DOM, so Figranium's editor
 * styles cannot leak into the host page (for example, a documentation site).
 */
export function mountFigraniumEmbedCsr(
  target: HTMLElement | string,
  options: MountFigraniumEmbedCsrOptions,
): FigraniumEmbedCsrController {
  const host = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!host) throw new Error('Figranium Embed target was not found.');

  const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles;
  const container = document.createElement('div');
  container.style.height = '100%';
  shadow.replaceChildren(style, container);

  const root: Root = createRoot(container);
  let task = options.task;
  let theme = options.theme ?? 'dark';

  const render = () => {
    root.render(
      <div data-theme={theme} style={{ height: '100%' }}>
        <FigraniumEmbedSurface
          task={task}
          height={options.height ?? 560}
          className={options.className}
          ariaLabel={options.title ?? 'Figranium task preview'}
        />
      </div>,
    );
  };

  render();

  return {
    setTask(nextTask) {
      task = nextTask;
      render();
    },
    setTheme(nextTheme) {
      theme = nextTheme;
      render();
    },
    destroy() {
      root.unmount();
      shadow.replaceChildren();
    },
  };
}
