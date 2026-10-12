// The id of the projects section, shared by the page and the scroll arrow in the hero.
export const PROJECTS_SECTION_ID = "projects";

export function scrollToProjects() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  document
    .getElementById(PROJECTS_SECTION_ID)
    ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}
