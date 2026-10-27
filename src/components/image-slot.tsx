import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "./ui";

/**
 * Renders a real photograph when one is set, and a deliberate, finished-looking
 * placeholder when one is not — so the site never looks broken before the
 * mission's own photography is dropped in.
 *
 * To use a real photo: put the file in /public/images/ and pass
 * src="/images/your-file.jpg".
 */
export function ImageSlot({
  src,
  alt,
  label,
  className,
  imageClassName,
  priority,
  sizes = "100vw",
}: {
  src?: string | null;
  alt: string;
  /** Shown inside the placeholder to tell the editor what belongs here. */
  label?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src && src.trim().length > 0) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-sunken", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role="img" aria-label={alt}
      className={cn("relative overflow-hidden bg-surface-sunken", className)}
    >
      {/* Layered warm wash so the empty state still reads as designed */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-clay-300/50 via-paper-300/40 to-ink-200/30 dark:from-clay-600/20 dark:via-ink-800 dark:to-ink-800/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 11px)",
        }}
      />
      <Mandala />
      {label ? (
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-ink-900/55 to-transparent px-4 py-3">
          <ImageIcon className="size-3.5 shrink-0 text-paper-100/80" aria-hidden />
          <p className="text-[0.6875rem] font-medium tracking-wide text-paper-100/90 uppercase">
            {label}
          </p>
        </div>
      ) : null}
    </div>
  );
}

/** Faint concentric ornament — gives the placeholder a centre of gravity. */
function Mandala() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200" className="absolute top-1/2 left-1/2 w-[55%] max-w-56 -translate-x-1/2 -translate-y-1/2 text-ink-900/15 dark:text-paper-100/15"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="100" cy="100" r="78" />
        <circle cx="100" cy="100" r="58" />
        <circle cx="100" cy="100" r="30" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="100" y1="100" x2="100" y2="22" transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
      </g>
      <circle cx="100" cy="100" r="6" fill="currentColor" />
    </svg>
  );
}
