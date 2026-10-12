import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hero } from "../data/hero";
import { scrollToProjects } from "../utils/scrollToProjects";

/**
 * The intro at the top of the home page.
 *
 * Flow:
 * 1. A card shows the headline, the intro line and the location (text from `data/hero.ts`).
 * 2. The bottom of the card fades into the page.
 * 3. A down arrow below it scrolls to the project list when clicked.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-12">
      {/* Card: the bottom fades into the page, which gives the hero its depth. */}
      <Card className="pb-48 [--card-spacing:--spacing(8)] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] sm:[--card-spacing:--spacing(14)]">
        <CardContent className="flex flex-col gap-16">
          {/* Headline, on the left */}
          <h1 className="font-heading text-5xl font-medium tracking-tight text-balance sm:text-7xl">
            {hero.headline}
          </h1>

          {/* Intro and location, pushed to the right half on wide screens */}
          <div className="text-lg sm:ml-auto sm:w-1/2">
            <p>{hero.intro}</p>
            <p className="text-muted-foreground">{hero.location}</p>
          </div>
        </CardContent>
      </Card>

      {/* Scroll arrow: jumps down to the project list */}
      <div className="flex justify-center py-16">
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Scroll to projects"
          onClick={scrollToProjects}
        >
          <ArrowDown className="size-6 text-muted-foreground" />
        </Button>
      </div>
    </section>
  );
}
