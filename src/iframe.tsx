import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Task } from '@figranium-source/embed';
import FigraniumEmbed from './FigraniumEmbed';
import './iframe.css';

const PROTOCOL_VERSION = 1;
const READY = 'figranium:embed:ready';
const SET_TASK = 'figranium:embed:set-task';
const RESIZE = 'figranium:embed:resize';

function IframeApp() {
  const [task, setTask] = useState<Task | null>(null);

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

      setTask(data.task as Task);
    };

    window.addEventListener('message', onMessage);
    sendReady();
    return () => window.removeEventListener('message', onMessage);
  }, []);

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
