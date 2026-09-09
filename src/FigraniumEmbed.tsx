import React, { useMemo, useRef } from 'react';
import type { Task } from '@figranium-source/embed';
import { CanvasView } from '@figranium-source/embed';
import './style.css';

export interface FigraniumEmbedProps {
  task: Task;
  className?: string;
  height?: number | string;
  ariaLabel?: string;
  scale?: number;
}

const noop = () => {};
const noopPointer = () => {};
const CanonicalCanvasView = CanvasView as React.ComponentType<any>;

/**
 * Read-only Figranium task surface.
 *
 * There is intentionally no editing API. No callbacks for task mutation,
 * persistence, execution, Open Browser, selector inspection, or configuration
 * are exposed. The interaction shield also prevents editor-internal controls
 * from becoming an accidental edit surface.
 */
export function FigraniumEmbed({
  task,
  className = '',
  height = 560,
  ariaLabel = 'Figranium task preview',
  scale = 1,
}: FigraniumEmbedProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const emptySet = useMemo(() => new Set<string>(), []);

  return (
    <div
      className={`figranium-embed ${className}`.trim()}
      style={{ height }}
      aria-label={ariaLabel}
      role="img"
    >
      <div className="figranium-embed__surface" aria-hidden="true">
        <CanonicalCanvasView
          currentTask={task}
          setCurrentTask={noop}
          canvasOffset={{ x: 0, y: 0 }}
          canvasScale={scale}
          canvasViewportRef={viewportRef}
          triggerExpanded={false}
          setTriggerExpanded={noop}
          onOpenCabinet={noop}
          handleAutoSave={noop}
          dragState={null}
          dragOverIndex={null}
          selectedActionIds={emptySet}
          setSelectedActionIds={noop}
          actionStatusById={{}}
          availableTasks={[]}
          selectorOptionsById={{}}
          updateAction={noop}
          openActionPalette={noop}
          openContextMenu={noop}
          handleActionPointerDown={noopPointer}
          onOpenHeadful={noop}
          isHeadfulOpen={false}
          onPointerDown={noopPointer}
          onPointerMove={noopPointer}
          onPointerUp={noop}
          onPointerCancel={noop}
          selectionBox={null}
          onAddStickyNote={noop}
          onUpdateStickyNote={noop}
          onDeleteStickyNote={noop}
          onDuplicateStickyNote={noop}
          selectedNoteIds={emptySet}
          autoOpenActionId={null}
          onClearAutoOpenActionId={noop}
        />
      </div>
      <div className="figranium-embed__interaction-shield" aria-hidden="true" />
    </div>
  );
}

export default FigraniumEmbed;
