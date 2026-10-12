import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateRange } from "@/lib/formatDateRange";
import type { Project } from "@/types/project";

// How many stack badges a card shows before the rest become "+N".
const MAX_BADGES = 5;

/**
 * A clickable card for one project, used on the work page.
 *
 * Flow:
 * 1. The whole card is a link to the project's page (`/project/:id`).
 * 2. The card shows the title, then the dates and one-line summary.
 * 3. Below that, the first few stack badges, with "+N" for the rest.
 * 4. An arrow on the right nudges forward when the card is hovered.
 */
export function ProjectCard({ project }: { project: Project }) {
  const stack = project.overview?.stack ?? [];
  const shownStack = stack.slice(0, MAX_BADGES);
  const hiddenCount = stack.length - shownStack.length;

  return (
    // 1. The link wraps the card, so the whole card is clickable.
    <Link
      to={`/project/${project.id}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="[--card-spacing:--spacing(6)] transition-colors group-hover:bg-muted sm:[--card-spacing:--spacing(8)]">
        <CardHeader>
          {/* 2. Title, then dates and summary */}
          <CardTitle className="text-2xl">{project.title}</CardTitle>
          <CardDescription className="text-base">
            <span className="font-medium text-foreground">
              {formatDateRange(project.date)}
            </span>{" "}
            — {project.summary}
          </CardDescription>

          {/* 4. Arrow on the right */}
          <CardAction>
            <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
          </CardAction>
        </CardHeader>

        {/* 3. Stack badges */}
        {stack.length > 0 && (
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {shownStack.map((item) => (
                <li key={item}>
                  <Badge variant="secondary">{item}</Badge>
                </li>
              ))}
              {hiddenCount > 0 && (
                <li>
                  <Badge variant="outline">+{hiddenCount}</Badge>
                </li>
              )}
            </ul>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
