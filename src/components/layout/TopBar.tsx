import { ArrowUpRight } from "lucide-react";
import { useLocation } from "react-router";
import { SlideLink } from "@/components/SlideLink";
import { site } from "@/config/site";

const tabs = [
  { label: "Info", to: "/" },
  { label: "Work", to: "/work" },
];

export function TopBar() {
  const { pathname } = useLocation();
  const activeIndex =
    pathname === "/"
      ? 0
      : pathname === "/work" || pathname.startsWith("/project/")
        ? 1
        : -1;
  return (
    <header className="site-header">
      <div className="site-container header-content">
        <p className="site-name">{site.name}</p>
        <nav aria-label="Pages" className="page-navigation">
          <div className="navigation-tabs">
            <span
              aria-hidden="true"
              className="navigation-indicator"
              style={{
                transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`,
                opacity: activeIndex < 0 ? 0 : 1,
              }}
            />
            {tabs.map((tab, index) => (
              <SlideLink
                key={tab.to}
                to={tab.to}
                aria-current={
                  activeIndex === index
                    ? pathname.startsWith("/project/")
                      ? "location"
                      : "page"
                    : undefined
                }
                className={`navigation-tab ${activeIndex === index ? "is-active" : ""}`}
              >
                {tab.label}
              </SlideLink>
            ))}
          </div>
        </nav>
        <nav aria-label="Profile links" className="profile-navigation">
          {site.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
