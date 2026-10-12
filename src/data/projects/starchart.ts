import type { Project } from "@/types/project";

export const starchart: Project = {
  id: "starchart",
  title: "StarChart",
  date: { start: "September 2026", end: "Present" },
  summary:
    "Find comic stories by describing them in plain words, see where they were published, and know what to read next.",
  overview: {
    problem:
      "Comics are hard to navigate. One character appears across dozens of series, relaunches and renumberings, and a crossover spreads one story across several titles. Existing databases are built for cataloging, not for finding a story by what happens in it, and reading-order guides say what to read but rarely help someone find a specific kind of story. StarChart lets a reader describe the story they want and returns real records from DC, Marvel, Image, Dark Horse and BOOM! Studios, showing where each was published, where it sits in the publisher's history, and what comes next.",
    users: [
      "Comic readers looking for a specific kind of story",
      "Newcomers from a comic book movie or show who want the comics behind it",
      "A group of friends who share reading lists and maps",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "SurrealDB",
      "Clerk",
      "Python",
      "DuckDB",
    ],
    links: [],
  },
  diagrams: [
    {
      title: "System data flow",
      caption:
        "The browser only talks to Next.js server code. Admin scripts load the catalog from the Grand Comics Database (GCD) dump and build the search embeddings.",
      mermaid: `flowchart LR
    Browser[Browser] --> App[Next.js server code]
    App --> DB[(SurrealDB)]
    App --> Embed[Embedding model]
    Script[Admin scripts] --> Dump[(GCD SQLite dump)]
    Script --> Embed
    Script --> DB`,
    },
    {
      title: "Catalog loading pipeline",
      caption:
        "How the catalog gets into the database. The full GCD download is cut down to the publishers StarChart covers, cleaned up, and saved. This is the new design, which is in progress.",
      mermaid: `flowchart LR
    Dump[(Full GCD download)] --> Cut[Keep only the<br/>publishers StarChart covers]
    Cut --> Small[(Smaller file)]
    Small --> Clean[Clean the data and<br/>decide what to keep]
    Eras[(Eras from<br/>the database)] --> Clean
    Clean --> Save[Save to the database]
    Save --> DB[(SurrealDB)]`,
    },
    {
      title: "Catalog data model",
      caption:
        "What the loader imports from GCD, plus eras, which StarChart defines. An issue's eras are derived from its date, so the issue-to-era link is not stored by hand.",
      mermaid: `erDiagram
    publisher ||--o{ series : publishes
    publisher ||--o{ era : defines
    series ||--o{ issue : contains
    issue ||--o{ story : contains
    issue }o--o{ era : "falls in"
    story }o--o{ story_arc : "part of"
    creator }o--o{ story : "credited on"
    series }o--o{ series : continues
    publisher {
        string name
        int year_began
        int year_ended
    }
    era {
        string name
        string description
        date start_date
        date end_date
    }
    series {
        string name
        int year_began
        int year_ended
    }
    issue {
        string number
        int sort_order
        string cover_date
        datetime on_sale_date
    }
    story {
        int sequence_number
        string title
        string synopsis
        string characters
    }
    story_arc {
        string name
        int year_first_published
    }
    creator {
        string name
    }`,
    },
    {
      title: "Reading lists, maps and progress",
      caption:
        "Everything readers create. A list item points at one series, issue or story. Progress is separate from lists, so completing an issue counts everywhere it appears.",
      mermaid: `erDiagram
    user ||--o{ reading_list : owns
    user ||--o{ reading_map : owns
    user ||--o{ progress : tracks
    reading_list ||--o{ reading_list_item : holds
    reading_map ||--o{ reading_map_list : orders
    reading_list ||--o{ reading_map_list : "included in"
    reading_map ||--o{ reading_map_detour : has
    reading_map_detour }o--|| reading_list_item : "leaves before"
    reading_map_detour }o--|| reading_list : "goes to"
    user {
        string display_name
        string role
    }
    reading_list {
        string name
        string visibility
        boolean is_featured
    }
    reading_list_item {
        int position
        string importance
    }
    reading_map {
        string name
        string visibility
    }
    reading_map_list {
        int position
    }
    reading_map_detour {
        boolean returns
    }
    progress {
        string status
        datetime completed_at
    }`,
    },
    {
      title: "Search entry",
      caption:
        "Each story and each era has one search entry: the text it is described by, the vector made from that text, and copies of the fields used to filter results. An era's entry leaves the series and creator filters empty.",
      mermaid: `erDiagram
    story ||--o| search_entry : "described by"
    era ||--o| search_entry : "described by"
    search_entry {
        string kind "story or era"
        string target "the story or era it describes"
        string text
        string text_hash
        string embedding_model
        int dimensions
        string publisher_id FK
        string series_id FK "empty for eras"
        string creator_ids FK "empty for eras"
        string era_ids FK "the story's eras, or the era itself"
        int year_start
        int year_end "empty if ongoing"
        boolean has_synopsis "always false for eras"
    }`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As a comic reader, I want to describe a story in plain words, so I can find it without knowing the title.",
      criteria: [
        "Results are real stories, never generated text.",
        "Each result links to its issue and series.",
        "I can narrow results by publisher, era, series, creator and year.",
        'Typing a name like "Batman #497" goes straight to that record.',
      ],
    },
    {
      id: "US-2",
      story:
        "As someone fresh from a comic book movie, I want to search for a character or event I saw, so I can find the comics where it happened.",
      criteria: [
        "A character search ranks the stories whose text mentions that character.",
        "Results show the series, issue and era of each story.",
        "I can filter results to one publisher.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a reader who wants a character from a particular period, such as Batman in the Golden Age, I want to search within a publishing era.",
      criteria: [
        "I can find an era by name and see its date range.",
        "I can limit a search to one era.",
        "An issue belongs to every era its date falls in. A September 2015 DC issue is in Modern Age, The New 52 and You.",
        "A July 1956 issue with no day is in both the Golden Age and the Silver Age.",
      ],
    },
    {
      id: "US-4",
      story:
        "As a reader, I want to open a story and see where it was published and what comes next.",
      criteria: [
        "The page shows the series, issue number as printed, date, creators with their roles, characters and eras.",
        "Each story appears once, with no reprint duplicates.",
        "It offers the next issue in the series, the next story in the story arc, and the series that continues this one.",
        "What comes next is worked out by rules from the data, with no model involved.",
      ],
    },
    {
      id: "US-5",
      story:
        "As a reader, I want to plan my reading with ordered lists and maps, so I know what to read and in what order.",
      criteria: [
        "A list holds series, issues or stories, each optionally marked essential, recommended, optional or skippable.",
        "A list is private or public by link, and only I can change it.",
        "A map groups lists in order, with detours that say where I leave a list and whether I come back.",
      ],
    },
    {
      id: "US-6",
      story: "As a reader, I want to track what I have read.",
      criteria: [
        "An item's status is planned, in progress, completed or skipped.",
        "Completing an issue marks it completed everywhere it appears.",
        "I have one status per item.",
      ],
    },
  ],
  // Test plan to come.
  tests: {
    approach: "",
    cases: [],
  },
  decisions: [
    {
      title: "Comics only, with no TV, movie or game data",
      context:
        "The first plan was a guide across film, television, games and comics, with separate outside metadata providers for each medium. That needed a data model general enough for any medium and several sources to keep matched to each other. Movies, television and games are also far better covered by existing databases than comics are, so the gap StarChart fills is in comics.",
      choice:
        "StarChart covers comics only: DC, Marvel, Image, Dark Horse and BOOM! Studios and their sub-brands. The data model is built around publishers, series, issues and stories instead of a model that fits any franchise or medium.",
      tradeoff:
        "StarChart holds no film or television records, so nothing in the data links a movie to its comics. A reader coming from a movie has to search by character or event.",
    },
    {
      title: "Build the catalog from the Grand Comics Database dump",
      context:
        "The first plan pulled basic metadata from outside providers through their APIs and cached one response per record. That ties the catalog to each provider's availability, rate limits and caching terms.",
      choice:
        "The catalog is seeded from the Grand Comics Database (GCD) data dump, an SQLite file of about 6.75 GB refreshed roughly every two weeks, limited to the six publishers StarChart covers. New releases arrive by replacing the dump and rerunning the loader.",
      tradeoff:
        "The catalog is only as complete and current as GCD. Downloading the dump needs a free GCD account, and the load has to be rerun to pick up new issues.",
    },
    {
      title: "Next.js with no separate backend",
      context:
        "An earlier plan put every business rule in a FastAPI service so mobile and desktop clients could share one API. That plan assumed the application would import and clean data itself. Now the data work happens once, when the catalog is loaded, so the application only reads clean records.",
      choice:
        "Next.js server code is the only code that talks to SurrealDB, checks Clerk sessions, enforces permissions and turns search queries into vectors. Every query goes through a server-only Data Access Layer that checks permissions and returns minimal results. That gives one deployment and one language for the application.",
      tradeoff:
        "A future mobile or desktop client has no ready-made API, so route handlers would have to be published as one or a service extracted. The project also keeps two environments: TypeScript for the app and Python for the loading scripts.",
    },
    {
      title: "Search by meaning with embeddings, not generated answers",
      context:
        "Finding a story by what happens in it is the center of the product, and catalog databases are built for lookups by name. The first plan launched with full-text search, deferred natural-language search, and planned a language model to write grounded answers.",
      choice:
        'Each story and era gets a search entry: text built by formatting its fields in a fixed order, and a vector made from that text by an embedding model. A query is turned into a vector by the same model, filters narrow by publisher, era, series, creator and year, and the nearest entries come back as real records. No language model writes the text or the answers. Full-text search is kept for exact lookups such as "Batman #497".',
      tradeoff:
        "Search quality depends on how much story text GCD has. On the DC slice, about 46% of comic stories have a synopsis and about 1.3% link to a story arc. Changing the embedding model means rebuilding every entry, so each entry stores its model name and a fingerprint of its text.",
    },
    {
      title: "Derive eras from date ranges",
      context:
        "GCD has no era data, but readers think in periods such as the Golden Age or the New 52, and those periods overlap.",
      choice:
        "Eras are a small table managed by an administrator. An issue's eras are every era of its publisher whose date range contains the issue's date: its on-sale date, or its cover date when there is none. An incomplete date such as July 1956 covers every day it could mean, so the issue gets every era that overlaps those days.",
      tradeoff:
        "Cover dates run a few months ahead of on-sale dates, so issues near an era boundary may need checking. Issues with no usable date are not loaded.",
    },
    {
      title: "Model stories, and keep characters as text",
      context:
        "GCD records credits per story, and one issue can hold a main story and backups, so the story is the natural unit to search.",
      choice:
        'A story is its own record, and creator credits attach to it. Characters stay as the text GCD has on the story, such as "Batman; Tim Drake [Robin]; Bane (villain)", and feed the story\'s search text. There are no character records.',
      tradeoff:
        "A character is not an exact filter. Searching for one ranks the stories whose text mentions them. There are no character pages.",
    },
    {
      title: "Load each story once",
      context:
        "GCD records reprints, variant covers and collected editions alongside the original material. Loading all of it would show the same story many times in search.",
      choice:
        "Only stories of type comic story are loaded. A story that reprints one already in the catalog is skipped, variant covers are skipped, and collected editions are not loaded. Issues with no usable date and series GCD flags as not comics publications are also left out.",
      tradeoff:
        "A reader cannot see from StarChart where a story was later reprinted or collected.",
    },
    {
      title: "Use GCD ids as record ids",
      context:
        "GCD refreshes its dump about every two weeks, so the loader has to run again each time without creating duplicates.",
      choice:
        "Imported records use their GCD id as the record id, such as issue:53372, so a rerun updates the same record instead of adding a copy. The loader is reviewed once and then runs deterministically. A language model never writes catalog records.",
      tradeoff:
        "Record identity is tied to GCD's ids. A rerun adds and updates records but does not remove ones GCD has since deleted.",
    },
    {
      title: "Run scripts by hand instead of building a job system",
      context:
        "The first plan called for background workers with a queue, retries and progress reporting. Loading the catalog and building embeddings only happen occasionally, when an administrator runs them.",
      choice:
        "Python scripts run by hand cut the dump down to the covered publishers, load the catalog and build embeddings. A durable job system waits until a task needs scheduling, retries or progress shown in the interface.",
      tradeoff:
        "Refreshing the catalog is a manual step, and a failed run is not retried automatically.",
    },
    {
      title: "Rewrite the loading scripts to use DuckDB",
      context:
        "The two scripts that load the catalog are long and hard to read: about 2,600 lines of Python, with 265 tests. Each cleaning rule is split across several small pieces of code that handle one row at a time. Speed is not the problem. Reading and deciding what to keep for every story of the six publishers takes 6.4 seconds.",
      choice:
        "Rewrite both scripts to use DuckDB, a tool for running database-style queries directly on a file. The first script reads the 6.75 GB download once and saves a smaller file with only the six publishers. Each cleaning rule becomes one short query that applies to a whole column of data at once. Python only does the parts a query cannot, like saving to the database. The saved records must come out identical to what the current scripts produce, which is checked table by table. This work is in progress.",
      tradeoff:
        "It adds DuckDB as a new tool to depend on. Two jobs, cleaning up the links inside notes and writing the search text, may turn out harder to read as queries than as Python. If so, they stay in Python and the queries call them.",
    },
    {
      title: "Keep progress separate from lists",
      context:
        "The same issue can sit on several lists, and finishing it once should count everywhere.",
      choice:
        "Progress is its own record for each user and item, with a status of planned, in progress, completed or skipped. Marking an issue completed applies wherever it appears, whether or not it is on a list.",
      tradeoff:
        "A list item carries no state of its own, so a reader cannot keep a different status for the same item on each list.",
    },
  ],
};
