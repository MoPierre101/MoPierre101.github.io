import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Story } from "@/types/project";
import { Section } from "./Section";

/**
 * The "Requirements and user stories" section of a case study.
 *
 * Flow:
 * 1. If the project has no stories, renders nothing.
 * 2. Otherwise wraps them in a titled `Section`.
 * 3. Shows one card per story: its id, the story sentence, then its acceptance criteria as a list.
 */
export function StoriesSection({ stories = [] }: { stories?: Story[] }) {
  // 1. Nothing to show.
  if (stories.length === 0) return null;

  return (
    <Section id="stories" title="Requirements and user stories">
      <ol className="flex flex-col gap-4">
        {/* 3. One card per story */}
        {stories.map((story) => (
          <li key={story.id}>
            <Card className="[--card-spacing:--spacing(6)]">
              {/* Story id and the story itself */}
              <CardHeader>
                <CardDescription className="text-xs font-medium tracking-widest uppercase">
                  {story.id}
                </CardDescription>
                <CardTitle className="text-lg font-normal">
                  {story.story}
                </CardTitle>
              </CardHeader>

              {/* How we know the story is done */}
              <CardContent>
                <p className="mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  Acceptance criteria
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {story.criteria.map((criterion) => (
                    <li key={criterion}>{criterion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}
