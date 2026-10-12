import type { ComponentProps, MouseEvent } from "react";
import { NavLink } from "react-router";
import { useTransitionNavigate } from "@/hooks/useTransitionNavigate";

type TransitionLinkProps = Omit<ComponentProps<typeof NavLink>, "to"> & {
  to: string;
};

/**
 * A link that animates the page change instead of jumping.
 *
 * Flow:
 * 1. Draws a normal link, so it still works with right-click, new tab and keyboards.
 * 2. On a plain click, stops the browser's jump and calls `useTransitionNavigate` instead.
 * 3. Clicks with a modifier key (new tab, new window) are left to the browser.
 */
export function TransitionLink({ to, onClick, ...props }: TransitionLinkProps) {
  const transitionNavigate = useTransitionNavigate();

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
    transitionNavigate(to);
  }

  return <NavLink to={to} onClick={handleClick} {...props} />;
}
