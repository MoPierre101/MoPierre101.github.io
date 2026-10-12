import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";

/**
 * The bar pinned to the top of every page.
 *
 * Flow:
 * 1. Left: the site owner's name and title.
 * 2. Right: one button per profile link (LinkedIn, GitHub, Resume), each opening in a new tab.
 */
export function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-start justify-between gap-4 px-6 py-4">
        {/* 1. Name and title */}
        <div>
          <p className="font-medium">{site.name}</p>
          <p className="text-sm text-muted-foreground">{site.title}</p>
        </div>

        {/* 2. Profile links: each button is really a link */}
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
