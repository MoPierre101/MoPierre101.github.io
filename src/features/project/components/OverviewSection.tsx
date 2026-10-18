import { Badge } from "@/components/ui/badge";
import type { Overview } from "@/types/project";
import { Detail } from "./Detail";

/**
 * The summary block at the top of a case study, in two columns.
 *
 * Flow:
 * 1. Takes the project's `overview` (problem, users, stack, links) and fills in missing parts with empty ones.
 * 2. If all four are empty, renders nothing.
 * 3. Left column: the stack as badges, the users as a list, and the links.
 * 4. Right column: the problem statement.
 */
export function OverviewSection({ overview }: { overview?: Overview }) {
  // 1. Read the parts, using empty lists for anything missing.
  const { problem, users = [], stack = [], links = [] } = overview ?? {};

  // 2. Nothing to show.
  if (!problem && !users.length && !stack.length && !links.length) return null;

  return (
    <section
      aria-label="Overview"
      className="project-overview grid gap-9 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12"
    >
      {/* 3. Left column. Each Detail hides itself when its list is empty. */}
      <dl className="flex min-w-0 flex-col gap-7">
        {/* Stack: one badge per technology */}
        <Detail term="Stack">
          {stack.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {stack.map((item) => (
                <li key={item}>
                  <Badge variant="secondary">{item}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Detail>

        {/* Users: who the project is for */}
        <Detail term="Users">
          {users.length > 0 && (
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              {users.map((user) => (
                <li key={user}>{user}</li>
              ))}
            </ul>
          )}
        </Detail>

        {/* Links: open in a new tab */}
        <Detail term="Links">
          {links.length > 0 && (
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Detail>
      </dl>

      {/* 4. Right column: the problem */}
      {problem && (
        <div className="min-w-0">
          <p className="mb-2 text-[0.6875rem] leading-relaxed font-medium tracking-[0.08em] text-muted-foreground uppercase">
            Problem
          </p>
          <p className="max-w-[68ch] text-base leading-7">{problem}</p>
        </div>
      )}
    </section>
  );
}
