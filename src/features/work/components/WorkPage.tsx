import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

/**
 * The work page, shown at `/work`.
 *
 * Flow:
 * 1. Sets the browser tab title to "Work".
 * 2. Shows one card for every project in `data/projects`, each linking to its own page.
 */
export function WorkPage() {
  return (
    <main className="site-container work-page" tabIndex={-1}>
      {/* Tab title (React moves this into <head>) */}
      <title>Work</title>
      <h1 className="sr-only">Work</h1>

      {/* Project list */}
      <ul className="flex flex-col gap-4">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </main>
  );
}
