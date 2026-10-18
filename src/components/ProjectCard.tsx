import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { formatDateRange } from "@/lib/formatDateRange";
import type { Project } from "@/types/project";

const MAX_BADGES = 5;

export function ProjectCard({ project }: { project: Project }) {
  const stack = project.overview?.stack ?? [];
  const shownStack = stack.slice(0, MAX_BADGES);
  const hiddenCount = stack.length - shownStack.length;
  return (
    <Link to={`/project/${project.id}`} className="project-link">
      <Card className="work-card [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
        <CardHeader>
          <h2 className="work-card-title">{project.title}</h2>
          <CardDescription className="work-card-description">
            <span className="work-card-date">
              {formatDateRange(project.date)}
            </span>{" "}
            — {project.summary}
          </CardDescription>
          <CardAction>
            <ArrowRight size={19} aria-hidden="true" />
          </CardAction>
        </CardHeader>
        {stack.length > 0 && (
          <CardContent>
            <ul className="flex flex-wrap gap-1.5">
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
