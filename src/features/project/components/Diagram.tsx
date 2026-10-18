import { useLayoutEffect, useRef } from "react";
import { useMermaid } from "../hooks/useMermaid";

interface DiagramProps {
  number: number;
  title: string;
  caption?: string;
  code: string;
}

/**
 * One diagram, drawn from Mermaid text.
 *
 * Flow:
 * 1. `useMermaid` turns the `code` text into a picture (SVG) in the background.
 * 2. Above the picture: the figure number, the title and an optional caption.
 * 3. The picture appears in a bordered box once it is ready. If drawing failed, a message shows instead.
 */
export function Diagram({ number, title, caption, code }: DiagramProps) {
  // 1. Draw the diagram. `svg` is the finished picture, `failed` is true if drawing went wrong.
  const { svg, failed } = useMermaid(code);
  const viewport = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = viewport.current;
    const entry = frame?.querySelector(".node, .entityBox");
    if (!frame || !entry || !svg) return;
    const bounds = frame.getBoundingClientRect();
    const node = entry.getBoundingClientRect();
    const clippedX =
      node.left < bounds.left + 16 || node.right > bounds.right - 16;
    const clippedY =
      node.top < bounds.top + 16 || node.bottom > bounds.bottom - 16;
    frame.scrollTo({
      left: clippedX
        ? Math.max(
            0,
            frame.scrollLeft +
              node.left +
              node.width / 2 -
              bounds.left -
              frame.clientWidth / 2,
          )
        : frame.scrollLeft,
      top: clippedY
        ? Math.max(
            0,
            frame.scrollTop +
              node.top +
              node.height / 2 -
              bounds.top -
              frame.clientHeight / 2,
          )
        : frame.scrollTop,
      behavior: "instant",
    });
  }, [svg]);

  return (
    <figure className="project-diagram flex min-w-0 flex-col gap-4">
      {/* 2. Label */}
      <figcaption className="max-w-[74ch]">
        <p className="mb-1 text-[0.6875rem] leading-relaxed font-medium tracking-[0.08em] text-muted-foreground uppercase">
          Figure {number}
        </p>
        <h3 className="font-heading text-lg leading-snug font-medium tracking-[-0.015em]">
          {title}
        </h3>
        {caption && (
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {caption}
          </p>
        )}
      </figcaption>

      {/* 3. The picture, in a box that scrolls sideways if the diagram is wide */}
      <div
        ref={viewport}
        role="img"
        aria-label={title}
        aria-busy={!svg && !failed}
        tabIndex={0}
        data-kind={
          code.trimStart().startsWith("sequenceDiagram")
            ? "sequence"
            : "diagram"
        }
        className="project-diagram-viewport max-h-[min(70vh,40rem)] min-h-48 min-w-0 overflow-auto rounded-lg border border-border bg-card p-4 sm:p-6 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-none"
      >
        {failed ? (
          <p className="text-muted-foreground">
            This diagram could not be drawn.
          </p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        )}
      </div>
    </figure>
  );
}
