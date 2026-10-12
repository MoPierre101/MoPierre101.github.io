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

/**
 * The bar pinned to the top of every page.
 *
 * Flow:
 * 1. Left: the site owner's name.
 * 2. Middle: the Info and Work tabs. A project page counts as part of Work.
 * 3. Right: one button per profile link (LinkedIn, GitHub, Resume), each opening in a new tab.
 *
 * On a narrow screen the tabs drop to their own row under the name and links.
 * The bar has its own view-transition name, so it stays put while the pages slide.
 */
export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur [view-transition-name:topbar]">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-6 py-4 sm:grid-cols-[1fr_auto_1fr]">
        {/* 1. Name */}
        <p className="font-medium whitespace-nowrap">{site.name}</p>

        {/* 2. Page tabs */}
        <nav
          aria-label="Pages"
          className="order-last col-span-2 flex justify-center gap-1 sm:order-none sm:col-span-1"
        >
          {tabs.map((tab) => {
            const isActive =
              tab.to === "/"
                ? pathname === "/"
                : pathname === "/work" || pathname.startsWith("/project/");
            return (
              <SlideLink
                key={tab.to}
                to={tab.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </SlideLink>
            );
          })}
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
