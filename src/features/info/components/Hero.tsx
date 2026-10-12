import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { site } from "@/config/site";
import { hero } from "../data/hero";

/**
 * The intro at the top of the info page.
 *
 * Flow:
 * Everything is centred, one block under the other:
 * 1. The intro, a line about what the project pages contain, and the degree.
 * 2. A table of skills, one row per group.
 * 3. The email, with the location under it.
 * 4. The card's background fades out at the bottom. Only the background fades, so the text stays sharp.
 *
 * Text comes from `data/hero.ts`, and the email from `config/site.ts`.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-12 pb-12">
      <Card className="relative isolate bg-transparent ring-0 [--card-spacing:--spacing(8)] sm:[--card-spacing:--spacing(14)]">
        {/* Background layer: the card's look, fading into the page at the bottom */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 rounded-xl bg-card ring-1 ring-foreground/10 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        />

        <CardContent className="flex flex-col items-center gap-12 sm:gap-16">
          {/* 1. Intro */}
          <div className="flex max-w-xl flex-col gap-4 text-center">
            <h1 className="font-heading text-xl font-medium tracking-tight text-balance sm:text-2xl">
              {hero.intro}
            </h1>
            <p className="text-base text-muted-foreground">{hero.about}</p>
            <p className="text-sm text-muted-foreground">{hero.education}</p>
          </div>

          {/* 2. Skills, under the intro */}
          <div className="w-full sm:w-5/6">
            <p className="mb-2 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Skills
            </p>
            <Table>
              <TableBody>
                {hero.skills.map((group) => (
                  <TableRow key={group.category}>
                    <TableCell className="w-2/5 pl-0 align-top font-medium whitespace-normal">
                      {group.category}
                    </TableCell>
                    <TableCell className="align-top whitespace-normal text-muted-foreground">
                      {group.items.join(", ")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* 3. Bottom centre: email above the location */}
          <div className="flex flex-col items-center gap-1 pt-8 text-base text-muted-foreground">
            <a
              href={`mailto:${site.email}`}
              className="text-foreground underline underline-offset-4"
            >
              {site.email}
            </a>
            <p>{hero.location}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
