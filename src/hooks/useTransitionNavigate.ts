import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router";

// Which kind of page an address is.
function pageOf(path: string) {
  if (path === "/") return "info";
  if (path === "/work") return "work";
  if (path.startsWith("/project/")) return "project";
  return "other";
}

/**
 * Returns a function that goes to another page with an animation when one fits.
 *
 * Flow:
 * 1. Works out which kind of page the visitor is on and which kind they are going to.
 * 2. Info and work sit side by side, so moving between them slides (`data-slide` on the page says which way).
 * 3. Work and a project page morph: the project's title and details glide between the card and the page header (`data-morph`).
 * 4. Either animation runs inside a browser view transition. Anything else, reduced motion,
 *    or an older browser just navigates with no animation.
 */
export function useTransitionNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (to: string) => {
    const from = pageOf(pathname);
    const target = pageOf(to);

    const isTabMove =
      (from === "info" && target === "work") ||
      (from === "work" && target === "info");
    const isMorph =
      (from === "work" && target === "project") ||
      (from === "project" && target === "work");

    const canAnimate =
      (isTabMove || isMorph) &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canAnimate) {
      navigate(to);
      return;
    }

    // Going right slides the old page out to the left. Going left does the opposite.
    const root = document.documentElement;
    if (isTabMove) root.dataset.slide = target === "work" ? "forward" : "back";
    else root.dataset.morph = "true";

    const transition = document.startViewTransition(() => {
      flushSync(() => navigate(to));
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    // The browser skips the animation when the tab is hidden and rejects `ready` when it does.
    // The page has still changed, so that is not an error worth reporting.
    transition.ready.catch(() => {});
    transition.finished
      .catch(() => {})
      .then(() => {
        delete root.dataset.slide;
        delete root.dataset.morph;
      });
  };
}
