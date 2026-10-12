import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { PROJECTS_SECTION_ID } from "../utils/scrollToProjects";
import { Hero } from "./Hero";

/**
 * The home page, shown at `/`.
 *
 * Flow:
 * 1. Sets the browser tab title to "Home".
 * 2. Shows the hero intro.
 * 3. Shows one card for every project in `data/projects`, each linking to its own page.
 */
export function HomePage() {
  return (
    <main>
      {/* Tab title (React moves this into <head>) */}
      <title>Home</title>

      {/* Intro */}
      <Hero />

      {/* Project list: the hero's arrow scrolls here, using the shared section id */}
      <section
        id={PROJECTS_SECTION_ID}
        aria-label="Projects"
        className="mx-auto max-w-5xl scroll-mt-20 px-6 pb-24"
      >
        <ul className="flex flex-col gap-6">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
