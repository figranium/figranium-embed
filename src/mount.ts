import type { Task } from '@figranium-source/embed';
import { GENERATED_IFRAME_DOCUMENT } from './generatedIframeDocument';

const READY = 'figranium:embed:ready';
const SET_TASK = 'figranium:embed:set-task';
const RESIZE = 'figranium:embed:resize';
const PROTOCOL_VERSION = 1;

export interface MountFigraniumEmbedOptions {
  task: Task;
  height?: number | string;
  className?: string;
  title?: string;
  autoResize?: boolean;
  /** Use only the CSS bundled with this package instead of checking for current Figranium styles. */
  preferBundled?: boolean;
}

export interface FigraniumEmbedController {
  iframe: HTMLIFrameElement;
  setTask(task: Task): void;
  destroy(): void;
}

export function mountFigraniumEmbed(
  target: HTMLElement | string,
  options: MountFigraniumEmbedOptions,
): FigraniumEmbedController {
  const host = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (!host) throw new Error('Figranium Embed target was not found.');

  const iframe = document.createElement('iframe');
  iframe.srcdoc = GENERATED_IFRAME_DOCUMENT;
  iframe.sandbox.add('allow-scripts');
  iframe.title = options.title ?? 'Figranium task';
  iframe.className = options.className ?? '';
  iframe.style.width = '100%';
  iframe.style.border = '0';
  iframe.style.display = 'block';
  iframe.style.height = typeof options.height === 'number' ? `${options.height}px` : (options.height ?? '600px');

  let task = options.task;
  const autoResize = options.autoResize ?? true;
  const preferBundled = options.preferBundled ?? false;

  const sendTask = () => {
    iframe.contentWindow?.postMessage(
      { type: SET_TASK, version: PROTOCOL_VERSION, task, preferBundled },
      '*',
    );
  };

  const onMessage = (event: MessageEvent) => {
    if (event.source !== iframe.contentWindow) return;
    if (event.data?.version !== PROTOCOL_VERSION) return;

    if (event.data?.type === READY) {
      sendTask();
      return;
    }

    if (autoResize && event.data?.type === RESIZE && Number.isFinite(event.data.height)) {
      iframe.style.height = `${Math.max(1, Math.ceil(event.data.height))}px`;
    }
  };

  window.addEventListener('message', onMessage);
  host.appendChild(iframe);

  return {
    iframe,
    setTask(nextTask: Task) {
      task = nextTask;
      sendTask();
    },
    destroy() {
      window.removeEventListener('message', onMessage);
      iframe.remove();
    },
  };
}
