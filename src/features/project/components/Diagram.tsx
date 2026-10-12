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

  return (
    <figure className="flex flex-col gap-3">
      {/* 2. Label */}
      <figcaption>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Figure {number}
        </p>
        <h3 className="font-heading text-xl font-medium">{title}</h3>
        {caption && <p className="mt-1 text-muted-foreground">{caption}</p>}
      </figcaption>

      {/* 3. The picture, in a box that scrolls sideways if the diagram is wide */}
      <div
        role="img"
        aria-label={title}
        className="overflow-x-auto rounded-xl bg-card p-6 ring-1 ring-foreground/10 [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
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
