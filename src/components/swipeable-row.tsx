"use client";

import { useRef, useState } from "react";
import { CheckIcon, TrashIcon } from "./icons";

const THRESHOLD = 80;
const MOVE_THRESHOLD = 8;
const MAX_DRAG = 140;

export function SwipeableRow({
  children,
  onSwipeLeft,
  onSwipeRight,
  disabled,
}: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  disabled?: boolean;
}) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    startRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled || !startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;

    if (!draggingRef.current) {
      if (Math.abs(dx) < MOVE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      draggingRef.current = true;
      setIsDragging(true);
      try {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } catch {
        // ignore — pointer capture is a nice-to-have, not critical
      }
    }

    e.preventDefault();
    let next = dx;
    if (!onSwipeRight) next = Math.min(next, 0);
    if (!onSwipeLeft) next = Math.max(next, 0);
    setDragX(Math.max(-MAX_DRAG, Math.min(MAX_DRAG, next)));
  };

  const handlePointerUp = () => {
    startRef.current = null;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);

    if (dragX <= -THRESHOLD && onSwipeLeft) {
      setIsRemoving(true);
      setDragX(-400);
      setTimeout(onSwipeLeft, 180);
      return;
    }
    if (dragX >= THRESHOLD && onSwipeRight) {
      onSwipeRight();
    }
    setDragX(0);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-md transition-[max-height,opacity] duration-200 ${
        isRemoving ? "max-h-0 opacity-0" : "max-h-[300px] opacity-100"
      }`}
    >
      {onSwipeRight && (
        <div className="absolute inset-y-0 left-0 flex w-20 items-center justify-center rounded-md bg-brand-green text-white">
          <CheckIcon className="h-6 w-6" />
        </div>
      )}
      {onSwipeLeft && (
        <div className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-md bg-red-600 text-white">
          <TrashIcon className="h-6 w-6" />
        </div>
      )}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 200ms ease-out",
          touchAction: "pan-y",
        }}
        className="relative"
      >
        {children}
      </div>
    </div>
  );
}
