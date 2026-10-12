import { ArrowLeft } from "lucide-react";
import { Navigate, useParams } from "react-router";
import { TransitionLink } from "@/components/TransitionLink";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/formatDateRange";
import { findProject } from "../utils/findProject";
import { hasContent } from "../utils/hasContent";
import { DecisionsSection } from "./DecisionsSection";
import { DiagramsSection } from "./DiagramsSection";
import { OverviewSection } from "./OverviewSection";
import { StoriesSection } from "./StoriesSection";

/**
 * One project's case study page, shown at `/project/:id`.
 *
 * Flow:
 * 1. Reads the `id` from the address (`/project/starchart` gives "starchart").
 * 2. Looks the project up. An unknown id redirects to the not-found page.
 * 3. Shows the header: back button to the work page, title, date and summary.
 *    The title and details share a view-transition name with the project's card, so they morph between the two pages.
 * 4. Shows the case study sections, or a note if the project has none yet.
 */
export function ProjectPage() {
  // 1. Which project does the address ask for?
  const { id } = useParams();

  // 2. Find it.
  const project = findProject(id);

  // An unknown id falls through to the not-found page.
  if (!project) return <Navigate to="/404" replace />;

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24">
      {/* Tab title: the project's name (React moves this into <head>) */}
      <title>{project.title}</title>

      {/* 3. Header */}
      <header className="flex flex-col items-start gap-6 pt-8 pb-14">
        <Button
          variant="outline"
          nativeButton={false}
          render={<TransitionLink to="/work" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <h1
          className="font-heading text-5xl font-medium tracking-tight text-balance sm:text-7xl"
          style={{ viewTransitionName: `project-${project.id}-title` }}
        >
          {project.title}
        </h1>
        <p
          className="text-lg text-muted-foreground"
          style={{ viewTransitionName: `project-${project.id}-meta` }}
        >
          <span className="font-medium text-foreground">
            {formatDateRange(project.date)}
          </span>{" "}
          — {project.summary}
        </p>
      </header>

      {/* 4. Case study. Each section hides itself when it has no data. */}
      {hasContent(project) ? (
        <div className="flex flex-col gap-20">
          <OverviewSection overview={project.overview} />
          <DiagramsSection diagrams={project.diagrams} />
          <StoriesSection stories={project.stories} />
          <DecisionsSection decisions={project.decisions} />
        </div>
      ) : (
        <p className="text-muted-foreground">
          This case study is still being written.
        </p>
      )}
    </main>
  );
}
