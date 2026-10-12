export interface Link {
  label: string;
  url: string;
}

export interface Overview {
  problem?: string;
  users?: string[];
  stack?: string[];
  links?: Link[];
}

export interface Diagram {
  title: string;
  caption?: string;
  /** Mermaid diagram source, for example "erDiagram ..." */
  mermaid: string;
}

export interface Story {
  id: string;
  story: string;
  criteria: string[];
}

export interface Decision {
  title: string;
  context?: string;
  choice?: string;
  tradeoff?: string;
}

export interface DateRange {
  /** For example "September 2026" */
  start: string;
  /** For example "August 2026", or "Present" for work that is still going */
  end: string;
}

export interface Project {
  id: string;
  title: string;
  date: DateRange;
  summary: string;
  overview?: Overview;
  diagrams?: Diagram[];
  stories?: Story[];
  decisions?: Decision[];
}
