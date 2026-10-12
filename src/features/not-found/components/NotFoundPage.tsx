import { Link } from "react-router";
import { Button } from "@/components/ui/button";

/**
 * The 404 page, shown for any address that no other route matches.
 *
 * Flow:
 * 1. Sets the browser tab title to "Not found".
 * 2. Tells the visitor the page doesn't exist.
 * 3. Offers a button back to the work page.
 */
export function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col items-start gap-4 px-6 py-24">
      {/* Tab title (React moves this into <head>) */}
      <title>Not found</title>

      {/* Message */}
      <p className="text-muted-foreground">That page could not be found.</p>

      {/* Way out: a button that is really a link to the work page */}
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link to="/work" />}
      >
        Back to work
      </Button>
    </main>
  );
}
