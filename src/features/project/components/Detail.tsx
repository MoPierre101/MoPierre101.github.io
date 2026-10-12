import type { ReactNode } from "react";

interface DetailProps {
  term: string;
  children?: ReactNode;
}

/**
 * A small label with its content underneath, for example "STACK" above a list of badges.
 * Must be placed inside a `<dl>`.
 *
 * Flow:
 * 1. If there is no content, renders nothing, so empty details never show a lonely label.
 * 2. Otherwise shows the label (`term`), then the content (`children`).
 */
export function Detail({ term, children }: DetailProps) {
  // 1. Nothing to show, so show nothing.
  if (!children) return null;

  return (
    <div>
      {/* 2. Label */}
      <dt className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
        {term}
      </dt>

      {/* 2. Content */}
      <dd>{children}</dd>
    </div>
  );
}
