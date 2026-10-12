import { projects } from "@/data/projects";

// Looks up a project by id. Gives back nothing when there is no such project.
export function findProject(id: string | undefined) {
  return projects.find((entry) => entry.id === id);
}
