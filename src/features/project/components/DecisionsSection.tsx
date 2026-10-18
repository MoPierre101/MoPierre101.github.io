import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Decision } from "@/types/project";
import { Detail } from "./Detail";
import { Section } from "./Section";

/**
 * The "Decisions and tradeoffs" section of a case study.
 *
 * Flow:
 * 1. If the project has no decisions, renders nothing.
 * 2. Otherwise wraps them in a titled `Section`.
 * 3. Shows one card per decision: its title, then Context, Choice and Tradeoff side by side.
 *    Any of those three that is missing is skipped by `Detail`.
 */
export function DecisionsSection({
  decisions = [],
}: {
  decisions?: Decision[];
}) {
  // 1. Nothing to show.
  if (decisions.length === 0) return null;

  return (
    <Section id="decisions" title="Decisions and tradeoffs">
      <ul className="project-decisions flex flex-col gap-4">
        {/* 3. One card per decision */}
        {decisions.map((decision) => (
          <li key={decision.title}>
            <Card className="[--card-spacing:--spacing(6)]">
              {/* What was decided */}
              <CardHeader>
                <CardTitle
                  role="heading"
                  aria-level={3}
                  className="text-lg leading-snug"
                >
                  {decision.title}
                </CardTitle>
              </CardHeader>

              {/* Why, what was picked, and what it cost */}
              <CardContent>
                <dl className="grid gap-6 lg:grid-cols-3 lg:gap-7">
                  <Detail term="Context">{decision.context}</Detail>
                  <Detail term="Choice">{decision.choice}</Detail>
                  <Detail term="Tradeoff">{decision.tradeoff}</Detail>
                </dl>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
