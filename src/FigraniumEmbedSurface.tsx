import React from 'react';
import type { Task } from '@figranium-source/embed';
import { ReadOnlyCanvas } from '@figranium-source/embed';

export interface FigraniumEmbedSurfaceProps {
  task: Task;
  className?: string;
  height?: number | string;
  ariaLabel?: string;
}

/** The unstyled read-only canvas surface, for scoped or shadow-DOM renderers. */
export function FigraniumEmbedSurface({
  task,
  className = '',
  height = 560,
  ariaLabel = 'Figranium task preview',
}: FigraniumEmbedSurfaceProps) {
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
