"use client";

import { useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "./ui";

/**
 * A plain, self-hosted video panel.
 *
 * Deliberately not autoplaying with sound: it starts paused with a poster
 * frame, so nobody lands on the page and gets audio they did not ask for.
 */
export function VideoPanel({
  src,
  poster,
  label,
  className,
  portrait = false,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  portrait?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function toggleMute() {
    const el = ref.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  return (
    <figure
      className={cn(
"group relative overflow-hidden  border border-line bg-ink-950 shadow-lift",
        portrait ? "aspect-[478/850]" : "aspect-video",
        className,
      )}
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        playsInline
        preload="metadata" onEnded={() => setPlaying(false)}
        onClick={toggle}
        className="size-full cursor-pointer object-cover"
      />

      {/* Play overlay — only while paused */}
      {!playing ? (
        <button
          type="button" onClick={toggle}
          aria-label={`Play: ${label}`}
          className="absolute inset-0 flex items-center justify-center bg-ink-950/35 transition-colors hover:bg-ink-950/25"
        >
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-accent text-on-accent shadow-lift transition-transform group-hover:scale-105">
            <Play className="ml-0.5 size-6 fill-current" aria-hidden />
          </span>
        </button>
      ) : null}

      {/* Controls — appear once playing */}
      {playing ? (
        <div className="absolute right-3 bottom-3 flex gap-2">
          <button
            type="button" onClick={toggle}
            aria-label="Pause" className="inline-flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-paper-100 backdrop-blur-sm transition-colors hover:bg-ink-950/90"
          >
            <Pause className="size-4" aria-hidden />
          </button>
          <button
            type="button" onClick={toggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="inline-flex size-9 items-center justify-center rounded-full bg-ink-950/70 text-paper-100 backdrop-blur-sm transition-colors hover:bg-ink-950/90"
          >
            {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
          </button>
        </div>
      ) : null}

      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
