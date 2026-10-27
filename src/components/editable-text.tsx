import type { ReactNode } from "react";

/**
 * Renders text that may still contain [[placeholders]] from the content files.
 *
 * Placeholders are highlighted rather than hidden. That is deliberate: an
 * unfilled detail should be impossible to miss on the live site, so it gets
 * filled in rather than quietly shipping as vague copy. Once every [[ ]] in
 * src/content/maharaj.ts is replaced with the real detail, these markers
 * disappear on their own.
 */
export function EditableText({ text }: { text: string }) {
  return <>{renderSegments(text)}</>;
}

/** Same, but splits blank lines into paragraphs first. */
export function EditableParagraphs({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={className}>
          {renderSegments(paragraph)}
        </p>
      ))}
    </>
  );
}

// Order matters: **bold** must be tried before *italic*, or the outer
// asterisks of a bold run get left behind as stray characters.
const PATTERN = /\[\[([^\]]+)\]\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function renderSegments(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  PATTERN.lastIndex = 0;
  while ((match = PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(
        <mark
          key={`p${key++}`}
          title="Placeholder — edit src/content/maharaj.ts to replace this with the real detail." className=" bg-clay-300/55 px-1 py-0.5 text-[0.9em] text-clay-700 dark:bg-clay-600/20 dark:text-clay-300"
        >
          {match[1]}
        </mark>,
      );
    } else if (match[2] !== undefined) {
      nodes.push(
        <strong key={`b${key++}`} className="font-bold text-content">
          {match[2]}
        </strong>,
      );
    } else if (match[3] !== undefined) {
      nodes.push(<em key={`e${key++}`}>{match[3]}</em>);
    }
    lastIndex = PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/** True when the string still has an unfilled placeholder. */
export function hasPlaceholder(text: string) {
  return /\[\[[^\]]+\]\]/.test(text);
}
