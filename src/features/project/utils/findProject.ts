import { projects } from "@/data/projects";

// Looks up a project by id, plus the project that follows it (which wraps around to the first).
export function findProject(id: string | undefined) {
  const foundProjectIndex = projects.findIndex((entry) => entry.id === id);
  if (foundProjectIndex === -1) return undefined;

  const nextProject =
    projects.length > 1
      ? projects[(foundProjectIndex + 1) % projects.length]
      : undefined;

  return { project: projects[foundProjectIndex], nextProject };
}
