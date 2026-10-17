import type { Project } from "@/types/project";

export const starchart: Project = {
  id: "starchart",
  title: "StarChart",
  date: { start: "September 2026", end: "Present" },
  summary:
    "A comic discovery app in development that lets readers describe a story in plain language, find where it was published, and see how it fits into a publisher's history.",
  overview: {
    problem:
      "Comics are hard to navigate. One character appears across dozens of series, relaunches and renumberings, and a crossover spreads one story across several titles. Existing databases are built for cataloging, not for finding a story by what happens in it, and reading-order guides say what to read but rarely help someone find a specific kind of story. StarChart will let a reader describe the story they want and return real records from DC, Marvel, Image, Dark Horse, BOOM! Studios and eight other publishers, showing where each was published and where it sits in the publisher's history.",
    users: [
      "Comic readers looking for a specific story",
      "TV and movie watchers who want the comics behind a show or film",
      "History explorers who want to see how a publisher's work developed",
      "Parents and guardians who want to know whether an issue is family friendly",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase (Postgres, Auth and Edge Functions)",
      "pgvector",
      "gte-small",
      "Python",
      "SQLite",
      "pgloader",
      "Grand Comics Database (GCD) API",
    ],
    links: [],
  },
  diagrams: [
    {
      title: "Catalog loading pipeline",
      caption:
        "How the catalog gets into the database. The full Grand Comics Database (GCD) download is stripped down to the 13 publishers StarChart covers, loaded into a raw holding schema with pgloader, cleaned with SQL into a reference schema, and used to build the app's derived tables and search embeddings. The file shrinks from 6.3 GB to 592 MB.",
      mermaid: `flowchart LR
    Dump[(Full GCD dump<br/>6.3 GB)] --> Strip[Strip to<br/>13 publishers]
    Strip --> Small[(stripped.db<br/>592 MB)]
    Small --> Load[pgloader]
    Load --> Raw[(gcd_raw<br/>temporary)]
    Raw --> Clean[SQL clean]
    Clean --> Gcd[(gcd<br/>reference data)]
    Gcd --> Derived[Derived tables<br/>in starchart]
    Gcd --> Embed[Search embeddings<br/>in starchart]`,
    },
    {
      title: "Catalog data model",
      caption:
        "The cleaned GCD schema. A series holds issues, and an issue holds stories. A variant (alternate cover) points back to its regular issue. Credits and characters hang off the story, and reprints link a story or issue to the one it reprints.",
      mermaid: `erDiagram
    publisher ||--o{ series : publishes
    series ||--o{ issue : contains
    issue ||--o{ story : contains
    issue |o--o{ issue : "variant of"
    story }o--o{ story_arc : "part of"
    story ||--o{ story_credit : has
    creator ||--o{ story_credit : credited
    story ||--o{ story_character : features
    character ||--o{ story_character : appears
    story ||--o{ reprint : "reprinted in"
    series }o--o{ series : "series bond"`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As a comic reader, I want to describe a story in plain words, so I can find it without the title.",
      criteria: [
        "The app turns the query into a vector with the same model that embedded the stories and returns the nearest stories.",
        "Each result shows its series, issue and cover, and links to the issue.",
        "Results can be narrowed by publisher, date range, creator, character, and single issue vs. collection.",
        "Variant covers don't appear as separate results. They are grouped under the regular issue.",
      ],
    },
    {
      id: "US-2",
      story:
        "As a movie or TV watcher, I want to look up a character, so I can read where they began.",
      criteria: [
        "A character page shows the character's first appearance and major series.",
        "First appearances are computed from structured character rows, never from free text.",
        "Search can be filtered by character.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a history explorer, I want a publisher timeline, so I can see what came out when.",
      criteria: [
        "The timeline lists regular issues by date, with first-appearance milestones marked.",
        "Dates show the precision GCD records: a year, a year and month, or a full date.",
        "Issues with no usable date stay in the catalog but are left off the timeline.",
        "Publisher renames and imprints appear, for example Detective Comics, then National, then DC.",
      ],
    },
    {
      id: "US-4",
      story:
        "As a reader, I want a crossover's issues in order across titles, so I know what to read next.",
      criteria: [
        "The app lists an arc's issues in publication order across titles.",
        "Order comes only from GCD story arcs. The app invents none.",
        "A story with no arc has no reading order, and the app shows none.",
      ],
    },
    {
      id: "US-5",
      story:
        "As a reader, I want a release calendar and the ability to follow a publisher or series, so I hear about new releases.",
      criteria: [
        "The calendar shows upcoming issues that aren't in the dump yet.",
        "A signed-in reader's follow is saved by publisher or series.",
        "A new announcement for something followed triggers a notification.",
      ],
    },
    {
      id: "US-6",
      story:
        "As a reader, I want a creator's page, so I can see their run across series.",
      criteria: [
        "The page lists the stories a creator is credited on, grouped by series.",
        "Pages come from credit rows. Credits that exist only as text don't create a page.",
      ],
    },
    {
      id: "US-7",
      story:
        "As a parent, I want a family-friendly label, so I know whether to open an issue with my child.",
      criteria: [
        "Every issue and story shows FF, NFF or Unknown.",
        "Issues with no rating signal show Unknown, never a guess.",
        "NFF content stays searchable and visible, with the warning.",
      ],
    },
    {
      id: "US-8",
      story:
        "As a reader, I want a link to a library or store, so I can read what I found.",
      criteria: [
        "An issue or collection page shows its stored links, each with a label and URL.",
        "The page says so when no links exist.",
      ],
    },
  ],
  decisions: [
    {
      title: "Use GCD as the single source of truth",
      context:
        "Catalog data could come from several outside providers, each with its own ids, rate limits and terms, and their records would need matching to each other.",
      choice:
        "The Grand Comics Database supplies series, issues, stories and cover images under one set of ids, so there is no matching step. A one-time data dump seeds the catalog. The GCD API supplies covers, fetched when a series is first opened, and only the cover URL is stored.",
      tradeoff:
        "The catalog follows GCD's coverage. Anonymous API access has per-hour limits, may be turned off, and its data format is not stable, so the app throttles from response headers. Cover images are not under GCD's license, so the app links to them and never copies them.",
    },
    {
      title: "Limit the catalog to 13 publishers",
      context:
        "The dump covers every publisher, language and publication type, and most of it is not the comic content StarChart is for.",
      choice:
        "The app keeps 13 publishers, English, Spanish and French only, and comic, text, cartoon and photo stories. It drops non-comics, giveaway, promo and ashcan series (799 series and 1,839 issues). The dump shrinks from 6.3 GB to 592 MB.",
      tradeoff:
        "A smaller catalog loads and searches quickly. Choosing publishers by id rather than country keeps Titan, which GCD lists as a UK publisher.",
    },
    {
      title: "Separate reference data from app data",
      context:
        "A newer GCD dump has to be loaded without touching users, follows or embeddings.",
      choice:
        "The cleaned gcd schema is reference data, dropped and rebuilt on every run. The starchart schema holds app data, and its tables are keyed by plain GCD ids with no foreign keys into gcd. Tables worked out from the catalog are rebuilt after every run. Embeddings, covers, follows and other app-created data are never rebuilt.",
      tradeoff:
        "A re-clean cannot damage user data. The cost is that nothing enforces the links, so a check after each run reports any ids a newer dump no longer contains.",
    },
    {
      title: "Build a staged, rerunnable pipeline",
      context:
        "The raw dump holds deleted rows, unused columns, and inconsistent dates, text and credits.",
      choice:
        "The pipeline strips the dump to the 13 publishers, loads it with pgloader into a temporary raw schema, cleans it with SQL into gcd, drops the raw schema, then builds the derived tables.",
      tradeoff:
        "Each cleaning rule has one place to live and can rerun without reloading. A change to the stripping rules means starting again from a fresh dump.",
    },
    {
      title: "Search by meaning with embeddings",
      context:
        "Finding a story by what happens in it is the core of the product, and catalog databases are built for lookups by name.",
      choice:
        "Stories are turned into vectors by an embedding model, and a reader's query is turned into a vector by the same model. Filters narrow the candidates and the nearest vectors come back as real records. The model is gte-small (384 dimensions), run in Supabase Edge Functions. Each vector stores the model that made it and a fingerprint of its source text.",
      tradeoff:
        "At 1,536 dimensions the vectors would take about 3.4 GB. A 384-dimension model takes a quarter of that, which matters against Supabase's free tier of about 500 MB. The model is a low-commitment starting test, and changing it later means re-embedding every story.",
    },
    {
      title: "Keep variants, search regular issues only",
      context:
        "Alternate covers are separate records in GCD, and they would flood search results and the timeline.",
      choice:
        "Every variant is kept and linked to its regular issue. Search, the timeline, the calendar and counts use regular issues only. An issue page lists its variants and loads their covers on demand.",
      tradeoff:
        "Keeping variants preserves reprint links and covers. Some issues have many variants, so their covers load in pages instead of all at once.",
    },
    {
      title: "Derive the FF/NFF label from a rating class",
      context:
        "Most issues have no printed rating, and the tags that could signal mature content were too weak to rely on.",
      choice:
        "Every issue and story gets a rating class worked out from the printed rating and the story's genre, and the app reads the FF, NFF or Unknown label from that class. A hand-kept correction can override a series.",
      tradeoff:
        "Unrated issues show Unknown instead of a guess. Because the app reads the label from the class, the family-friendly line can move without a new pipeline run.",
    },
    {
      title: "Store dates as parts with a precision",
      context:
        "GCD dates can be a year only, a month with no day, or a value like 2000-06-00 that a Postgres date cannot hold.",
      choice:
        "Cover and on-sale dates become year, month and day as separate numbers, plus a precision and a derived sortable date. An invalid day becomes null and the month is kept.",
      tradeoff:
        "The model keeps what GCD actually knows without inventing a day. Issues with no usable date stay in the catalog but drop out of date-based views.",
    },
  ],
};
