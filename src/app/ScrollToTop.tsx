import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Makes every new page open at the top of the screen. Draws nothing.
 *
 * Flow:
 * 1. Reads the current page path from the router.
 * 2. Whenever the path changes, jumps to the top of the window with no animation.
 *
 * Without it, a page opened from halfway down the previous one would start scrolled down too.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
