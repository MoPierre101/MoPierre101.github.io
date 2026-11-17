import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
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
 * 3. Shows the header: back button to the work page, title, date, summary and section jump-links.
 * 4. Shows the case study sections, or a note if the project has none yet.
 */
export function ProjectPage() {
  // 1. Which project does the address ask for?
  const { id } = useParams();

  // 2. Find it.
  const project = findProject(id);

  // An unknown id falls through to the not-found page.
  if (!project) return <Navigate to="/404" replace />;

  const { problem, users = [], stack = [], links = [] } =
    project.overview ?? {};
  const hasOverview = Boolean(
    problem || users.length || stack.length || links.length,
  );
  const toc = [
    hasOverview && { id: "overview", label: "Overview" },
    (project.diagrams?.length ?? 0) > 0 && {
      id: "diagrams",
      label: "Diagrams",
    },
    (project.stories?.length ?? 0) > 0 && {
      id: "stories",
      label: "User stories",
    },
    (project.decisions?.length ?? 0) > 0 && {
      id: "decisions",
      label: "Decisions",
    },
  ].filter(Boolean) as { id: string; label: string }[];

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="project-page site-container pb-20" tabIndex={-1}>
      {/* Tab title: the project's name (React moves this into <head>) */}
      <title>{`${project.title} — ${site.name}`}</title>

      {/* 3. Header */}
      <header className="project-header flex flex-col items-start gap-5 pt-8 pb-12 sm:pt-10 sm:pb-14">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/work" />}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Button>
        <h1 className="max-w-full font-heading text-[2rem] leading-tight font-medium tracking-[-0.035em] text-balance sm:text-[2.75rem]">
          {project.title}
        </h1>
        <p className="max-w-[74ch] text-[0.9375rem] leading-7 text-muted-foreground">
          <span className="text-[0.8125rem] font-medium text-foreground tabular-nums">
            {formatDateRange(project.date)}
          </span>{" "}
          — {project.summary}
        </p>
        {toc.length > 1 && (
          <nav
            aria-label="Case study sections"
            className="flex flex-wrap items-center gap-2 pt-1"
          >
            {toc.map((item) => (
              <Button
                key={item.id}
                variant="secondary"
                size="sm"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </header>

      {/* 4. Case study. Each section hides itself when it has no data. */}
      {hasContent(project) ? (
        <div className="project-sections flex flex-col gap-14 sm:gap-16">
          <OverviewSection overview={project.overview} />
          <DiagramsSection diagrams={project.diagrams} />
          <StoriesSection stories={project.stories} />
          <DecisionsSection decisions={project.decisions} />
          <div className="pt-2">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link to="/work" />}
            >
              <ArrowLeft data-icon="inline-start" />
              Back to Work
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">
          This case study is still being written.
        </p>
      )}
    </main>
  );
}
