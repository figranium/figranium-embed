import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Task } from '@figranium-source/embed';
import FigraniumEmbed from './FigraniumEmbed';
import './iframe.css';

const PROTOCOL_VERSION = 1;
const READY = 'figranium:embed:ready';
const SET_TASK = 'figranium:embed:set-task';
const RESIZE = 'figranium:embed:resize';
const LIVE_CSS_URL = 'https://raw.githubusercontent.com/figranium/figranium/embed-assets/embed.css';

function IframeApp() {
  const [task, setTask] = useState<Task | null>(null);
  const [preferBundled, setPreferBundled] = useState<boolean | null>(null);

  useEffect(() => {
    let lockedOrigin: string | null = null;
    let lockedSource: MessageEventSource | null = null;

    const sendReady = () => {
      window.parent.postMessage({ type: READY, version: PROTOCOL_VERSION }, '*');
    };

    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent) return;
      const data = event.data;
      if (!data || data.type !== SET_TASK || data.version !== PROTOCOL_VERSION || !data.task) return;

      if (lockedOrigin === null) {
        lockedOrigin = event.origin;
        lockedSource = event.source;
      }
      if (event.origin !== lockedOrigin || event.source !== lockedSource) return;

      setPreferBundled(Boolean(data.preferBundled));
      setTask(data.task as Task);
    };

    window.addEventListener('message', onMessage);
    sendReady();
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (preferBundled !== false) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);

    void fetch(LIVE_CSS_URL, { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Live Figranium CSS returned ${response.status}`);
        const css = await response.text();
        if (!css.includes('--app-bg') || css.length < 1000) {
          throw new Error('Live Figranium CSS failed validation.');
        }

        const style = document.createElement('style');
        style.dataset.figraniumLive = 'true';
        style.textContent = css;
        document.head.appendChild(style);
      })
      .catch(() => {
        // Bundled CSS remains active as the offline/unavailable fallback.
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
      document.querySelector('style[data-figranium-live="true"]')?.remove();
    };
  }, [preferBundled]);

  useEffect(() => {
    if (!task) return;
    const observer = new ResizeObserver(() => {
      window.parent.postMessage(
        { type: RESIZE, version: PROTOCOL_VERSION, height: document.documentElement.scrollHeight },
        '*',
      );
    });
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [task]);

  if (!task) {
    return <div className="figranium-iframe-empty" aria-hidden="true" />;
  }

  return <FigraniumEmbed task={task} height="100%" />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IframeApp />
  </React.StrictMode>,
);
