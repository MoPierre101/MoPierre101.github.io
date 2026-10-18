import { useEffect, useState } from "react";

// Mermaid needs an id that is unique for every render, even when two renders overlap.
let renderCount = 0;

// Draws Mermaid source as an SVG string, in the site's dark theme.
export function useMermaid(code: string) {
  const [svg, setSvg] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      try {
        // Loaded on demand, so Mermaid is only downloaded by pages that have a diagram.
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
        });
        const result = await mermaid.render(`diagram-${renderCount++}`, code);
        // Keep diagram labels at their authored size; narrow frames pan natively.
        const template = document.createElement("template");
        template.innerHTML = result.svg;
        const diagram = template.content.querySelector("svg");
        const width = Number(diagram?.getAttribute("viewBox")?.split(/\s+/)[2]);
        if (diagram && Number.isFinite(width) && width > 0) {
          diagram.style.width = `${width}px`;
          diagram.style.maxWidth = "none";
          diagram.style.height = "auto";
        }
        diagram
          ?.querySelectorAll("[filter]")
          .forEach((element) => element.removeAttribute("filter"));
        diagram
          ?.querySelectorAll<SVGElement>("[style*='filter']")
          .forEach((element) => element.style.removeProperty("filter"));
        diagram
          ?.querySelectorAll("filter")
          .forEach((element) => element.remove());
        if (!cancelled) setSvg(template.innerHTML);
      } catch (error) {
        console.error(error);
        if (!cancelled) setFailed(true);
      }
    }

    draw();
    return () => {
      cancelled = true;
    };
  }, [code]);

  return { svg, failed };
}
