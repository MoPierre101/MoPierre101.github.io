import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router";

// The pages that sit side by side, left to right.
const TAB_PATHS = ["/", "/work"];

/**
 * Returns a function that goes to another page, sliding between the tab pages.
 *
 * Flow:
 * 1. Finds where the visitor is and where they are going in the left-to-right tab order.
 * 2. If both are tab pages and the browser supports view transitions, marks the direction on
 *    the page (`data-slide`) so the CSS in `index.css` knows which way to slide.
 * 3. Switches pages inside the browser's view transition, which animates the old page out and the new one in.
 * 4. In every other case (a project page, reduced motion, an older browser) it just navigates.
 */
export function useSlideNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (to: string) => {
    const from = TAB_PATHS.indexOf(pathname);
    const target = TAB_PATHS.indexOf(to);

    const canSlide =
      from !== -1 &&
      target !== -1 &&
      from !== target &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canSlide) {
      navigate(to);
      return;
    }

    // Going right slides the old page out to the left. Going left does the opposite.
    document.documentElement.dataset.slide = target > from ? "forward" : "back";

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
        delete document.documentElement.dataset.slide;
      });
  };
}
