import type { Project } from "@/types/project";

// True when the project has any case study content to show beyond its card details.
export function hasContent({
  overview,
  diagrams,
  stories,
  decisions,
}: Project) {
  return Boolean(
    overview?.problem ||
    overview?.users?.length ||
    overview?.stack?.length ||
    overview?.links?.length ||
    diagrams?.length ||
    stories?.length ||
    decisions?.length,
  );
}
