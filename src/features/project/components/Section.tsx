import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * The frame every big block on the project page shares.
 *
 * Flow:
 * 1. Draws a divider line.
 * 2. Draws a large heading with the `title`.
 * 3. Shows whatever is placed between the `<Section>` tags (`children`) underneath.
 *
 * The `id` lets the section be linked to, and `aria-labelledby` points screen readers at its heading.
 */
export function Section({ id, title, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="project-section scroll-mt-28"
    >
      {/* 1. Divider */}
      <Separator className="mb-7" />

      {/* 2. Heading */}
      <h2
        id={`${id}-title`}
        className="mb-7 font-heading text-xl leading-snug font-medium tracking-[-0.025em] sm:text-2xl"
      >
        {title}
      </h2>

      {/* 3. The section's content */}
      {children}
    </section>
  );
}
