import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateRange } from "@/lib/formatDateRange";
import type { Project } from "@/types/project";

/**
 * A clickable card for one project. Used on the home page and as "Next project".
 *
 * Flow:
 * 1. The whole card is a link to the project's page (`/project/:id`).
 * 2. The card shows the title, then the date and one-line summary.
 * 3. An arrow on the right nudges forward when the card is hovered.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    // 1. The link wraps the card, so the whole card is clickable.
    <Link
      to={`/project/${project.id}`}
      className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="[--card-spacing:--spacing(6)] transition-colors group-hover:bg-muted sm:[--card-spacing:--spacing(8)]">
        <CardHeader>
          {/* 2. Title, then date and summary */}
          <CardTitle className="text-2xl">{project.title}</CardTitle>
          <CardDescription className="text-base">
            <span className="font-medium text-foreground">
              {formatDateRange(project.date)}
            </span>{" "}
            — {project.summary}
          </CardDescription>

          {/* 3. Arrow on the right */}
          <CardAction>
            <ArrowRight className="size-6 transition-transform group-hover:translate-x-1" />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
}
