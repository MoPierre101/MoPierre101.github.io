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
    <section id={id} aria-labelledby={`${id}-title`}>
      {/* 1. Divider */}
      <Separator className="mb-10" />

      {/* 2. Heading */}
      <h2
        id={`${id}-title`}
        className="mb-8 font-heading text-3xl font-medium tracking-tight sm:text-4xl"
      >
        {title}
      </h2>

      {/* 3. The section's content */}
      {children}
    </section>
  );
}
