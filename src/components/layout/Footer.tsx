import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-container site-footer">
      <p>&copy; 2026 {site.name}. All Rights Reserved.</p>
    </footer>
  );
}
