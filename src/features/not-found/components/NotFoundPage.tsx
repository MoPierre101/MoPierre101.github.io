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
    <main className="site-container not-found-page" tabIndex={-1}>
      {/* Tab title (React moves this into <head>) */}
      <title>Not found</title>

      {/* Message */}
      <h1 className="text-lg font-medium">That page could not be found.</h1>

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
