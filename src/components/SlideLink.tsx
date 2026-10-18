import type { ComponentProps, MouseEvent } from "react";
import { Link } from "react-router";
import { useSlideNavigate } from "@/hooks/useSlideNavigate";

type SlideLinkProps = Omit<ComponentProps<typeof Link>, "to"> & {
  to: string;
};

/**
 * A link that slides between the info and work pages instead of jumping.
 *
 * Flow:
 * 1. Draws a normal link, so it still works with right-click, new tab and keyboards.
 * 2. On a plain click, stops the browser's jump and calls `useSlideNavigate` instead.
 * 3. Clicks with a modifier key (new tab, new window) are left to the browser.
 */
export function SlideLink({ to, onClick, ...props }: SlideLinkProps) {
  const slideNavigate = useSlideNavigate();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    const isPlainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;
    if (event.defaultPrevented || !isPlainClick) return;

    event.preventDefault();
    slideNavigate(to);
  }

  return <Link to={to} onClick={handleClick} {...props} />;
}
