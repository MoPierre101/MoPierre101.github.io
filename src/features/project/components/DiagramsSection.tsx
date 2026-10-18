import type { Diagram as DiagramData } from "@/types/project";
import { Diagram } from "./Diagram";
import { Section } from "./Section";

/**
 * The "Diagrams" section of a case study.
 *
 * Flow:
 * 1. If the project has no diagrams, renders nothing.
 * 2. Otherwise wraps them in a titled `Section`.
 * 3. Draws one numbered `Diagram` per entry (Figure 1, Figure 2, ...).
 */
export function DiagramsSection({
  diagrams = [],
}: {
  diagrams?: DiagramData[];
}) {
  // 1. Nothing to show.
  if (diagrams.length === 0) return null;

  return (
    <Section id="diagrams" title="Diagrams">
      {/* 3. One figure per diagram, numbered from 1 */}
      <div className="project-diagrams flex flex-col gap-9 sm:gap-10">
        {diagrams.map((diagram, index) => (
          <Diagram
            key={diagram.title}
            number={index + 1}
            title={diagram.title}
            caption={diagram.caption}
            code={diagram.mermaid}
          />
        ))}
      </div>
    </Section>
  );
}
