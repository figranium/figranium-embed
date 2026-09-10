import React from 'react';
import type { Task } from '@figranium-source/embed';
import { ReadOnlyCanvas } from '@figranium-source/embed';
import './style.css';

export interface FigraniumEmbedProps {
  task: Task;
  className?: string;
  height?: number | string;
  ariaLabel?: string;
}

/** Read-only Figranium task surface. */
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
        <ReadOnlyCanvas task={task} />
      </div>
    </div>
  );
}

export default FigraniumEmbed;
