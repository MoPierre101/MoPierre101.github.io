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
        if (!cancelled) setSvg(result.svg);
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
