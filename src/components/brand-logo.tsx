import Image from "next/image";
import { cn } from "./ui";

/**
 * The Travel With Guru mark — trishul and footprints within a temple arch.
 *
 * The supplied file is a JPEG on an ochre field, so it is framed rather than
 * floated: a rounded, bordered plate keeps the ochre block looking deliberate
 * in both light and dark mode. If a transparent PNG or SVG arrives later,
 * drop it in as /public/images/twg-logo.png and remove the frame classes.
 */
export function BrandLogo({
  className,
  priority,
  sizes = "(min-width: 1024px) 20rem, 60vw",
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
"relative overflow-hidden  border border-clay-400/30 shadow-soft",
        className,
      )}
    >
      <Image
        src="/images/twg-logo.jpg" alt="Travel With Guru — Walk the Path of Wisdom. India, Nepal, Malaysia." fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

/** Small square lockup for the header. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
"relative inline-block shrink-0 overflow-hidden  border border-clay-400/35",
        className,
      )}
    >
      <Image
        src="/images/twg-logo.jpg" alt="" fill
        sizes="48px" className="scale-[1.45] object-cover object-[50%_28%]"
      />
    </span>
  );
}
