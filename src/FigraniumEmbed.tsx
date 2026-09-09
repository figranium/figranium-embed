import React from 'react';
import type { Task } from 'figranium-ui-source/src/embed';
import { CanvasView } from 'figranium-ui-source/src/embed';
import './style.css';

export interface FigraniumEmbedProps {
  task: Task;
  className?: string;
  height?: number | string;
  ariaLabel?: string;
}

const noop = () => {};

/**
 * Read-only Figranium task surface.
 *
 * This component deliberately exposes no mutation, execution, browser, selector
 * picker, or persistence callbacks. The canonical Figranium CanvasView is used
 * directly so Embed does not maintain a parallel visual implementation.
 */
export function FigraniumEmbed({
  task,
  className = '',
  height = 560,
  ariaLabel = 'Figranium task preview',
}: FigraniumEmbedProps) {
  return (
    <div
      className={`figranium-embed ${className}`.trim()}
      style={{ height }}
      aria-label={ariaLabel}
      role="img"
    >
      <div className="figranium-embed__surface" aria-hidden="true">
        <CanvasView
          currentTask={task}
          setCurrentTask={noop as never}
          canvasOffset={{ x: 0, y: 0 }}
          setCanvasOffset={noop as never}
          scale={1}
          setScale={noop as never}
          onAutoSave={noop}
        />
      </div>
      <div className="figranium-embed__interaction-shield" />
    </div>
  );
}

export default FigraniumEmbed;
