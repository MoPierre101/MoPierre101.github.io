import { site } from "@/config/site";

/** The copyright line at the bottom of every page. */
export function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 py-10 text-sm text-muted-foreground">
      &copy; 2026 {site.name}. All Rights Reserved.
    </footer>
  );
}
