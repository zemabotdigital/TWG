"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "./ui";

/**
 * Fades and lifts its children into place the first time they scroll into
 * view — the reveal pattern used throughout the reference design.
 *
 * It reveals once and then stops observing, so nothing re-animates on the
 * way back up. If IntersectionObserver is unavailable the content is shown
 * immediately rather than left invisible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Stagger, in milliseconds. */
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);

    /*
      Safety net. An element that starts hidden and never receives its
      reveal is invisible content, which is far worse than a missing
      animation. Some environments (embedded viewers, prerenderers,
      pages restored from bfcache) never fire the observer, so after a
      short grace period everything is shown regardless.
    */
    const failSafe = window.setTimeout(() => {
      setInstant(true);
      setVisible(true);
      observer.disconnect();
    }, 1500);

    return () => {
      window.clearTimeout(failSafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", className)}
      data-visible={visible ? "true" : "false"}
      data-instant={instant ? "true" : undefined}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
