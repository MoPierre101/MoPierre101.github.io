import { ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router";
import { SlideLink } from "@/components/SlideLink";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

// The two pages, left to right.
const tabs = [
  { label: "Info", to: "/" },
  { label: "Work", to: "/work" },
];

// Which tab a page belongs to. A project page counts as part of Work.
function activeTabIndex(pathname: string) {
  if (pathname === "/") return 0;
  if (pathname === "/work" || pathname.startsWith("/project/")) return 1;
  return -1;
}

/**
 * The bar pinned to the top of every page.
 *
 * Flow:
 * 1. Left: the site owner's name.
 * 2. Middle: the Info and Work tabs, with one highlight that glides from the active tab to the next.
 * 3. Right: one button per profile link (LinkedIn, GitHub), each opening in a new tab.
 *
 * On a narrow screen the tabs drop to their own row under the name and links.
 * The bar has its own view-transition name, so it stays put while the pages slide.
 * The highlight and each tab label are named too, so the highlight glides during the slide
 * and the labels stay on top of it.
 */
export function TopBar() {
  const { pathname } = useLocation();
  const activeIndex = activeTabIndex(pathname);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur [view-transition-name:topbar]">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* 1. Name */}
        <p className="font-medium whitespace-nowrap">{site.name}</p>

        {/* 2. Page tabs: two equal columns, with one highlight that slides between them */}
        <nav
          aria-label="Pages"
          className="order-last col-span-2 flex justify-center sm:order-none sm:col-span-1"
        >
          <div className="relative grid grid-cols-2">
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 w-1/2 rounded-lg bg-muted transition-transform duration-300 ease-out motion-reduce:transition-none ${
                activeIndex === -1 ? "opacity-0" : ""
              }`}
              style={{
                transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
                viewTransitionName: "tab-pill",
              }}
            />
            {tabs.map((tab, index) => (
              <SlideLink
                key={tab.to}
                to={tab.to}
                className={`relative z-10 rounded-lg px-4 py-1.5 text-center text-sm font-medium transition-colors ${
                  index === activeIndex
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={{ viewTransitionName: `tab-${tab.label.toLowerCase()}` }}
              >
                {tab.label}
              </SlideLink>
            ))}
          </div>
        </nav>

        {/* 3. Profile links: each button is really a link */}
        <nav aria-label="Profile links" className="flex flex-wrap justify-end">
          {site.links.map((link) => (
            <Button
              key={link.label}
              variant="ghost"
              nativeButton={false}
              render={
                <a href={link.url} target="_blank" rel="noopener noreferrer" />
              }
            >
              {link.label}
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
