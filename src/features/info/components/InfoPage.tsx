import { site } from "@/config/site";
import { Hero } from "./Hero";

/**
 * The info page, shown at `/`. It is the first page a visitor sees.
 *
 * Flow:
 * 1. Sets the browser tab title to the site owner's name.
 * 2. Shows the hero intro.
 */
export function InfoPage() {
  return (
    <main tabIndex={-1}>
      {/* Tab title (React moves this into <head>) */}
      <title>{site.name}</title>

      {/* Intro */}
      <Hero />
    </main>
  );
}
