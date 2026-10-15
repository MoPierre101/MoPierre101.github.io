import type { Project } from "@/types/project";

export const starchart: Project = {
  id: "starchart",
  title: "StarChart",
  date: { start: "September 2026", end: "Present" },
  summary:
    "A comic discovery app in development that helps readers find stories in plain language, explore their publishing history, and plan what to read next.",
  overview: {
    problem:
      "Comics are hard to navigate. One character appears across dozens of series, relaunches and renumberings, and a crossover spreads one story across several titles. Existing databases are built for cataloging, not for finding a story by what happens in it, and reading-order guides say what to read but rarely help someone find a specific kind of story. StarChart will let a reader describe the story they want and return real records from DC, Marvel, Image, Dark Horse, BOOM! Studios and eight other publishers, showing where each was published, where it sits in the publisher's history, and what comes next.",
    users: [
      "Comic readers looking for a specific kind of story",
      "Newcomers from a comic book movie or show who want the comics behind it",
      "A group of friends who share reading lists and maps",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase (Postgres and Auth)",
      "pgvector",
      "Python",
      "SQLite",
      "pgloader",
    ],
    links: [],
  },
  diagrams: [
    {
      title: "System data flow",
      caption:
        "The browser only talks to Next.js server code. Admin scripts load the catalog from the Grand Comics Database (GCD) dump once and build the search embeddings. After that, the GCD API keeps the catalog current.",
      mermaid: `flowchart LR
    Browser[Browser] --> App[Next.js server code]
    App --> DB[(Supabase Postgres<br/>with pgvector)]
    App --> Auth[Supabase Auth]
    App --> Embed[Embedding model]
    Script[Admin scripts] --> Dump[(GCD SQLite dump)]
    Script --> API[GCD API]
    Script --> Embed
    Script --> DB`,
    },
    {
      title: "Catalog loading pipeline",
      caption:
        "How the catalog gets into the database. The full GCD download is cleaned in place down to the 13 publishers StarChart covers, loaded into a holding schema with pgloader, and turned into catalog tables with SQL. Cleaning and loading are done; the SQL step is in progress.",
      mermaid: `flowchart LR
    Dump[(Full GCD download)] --> Clean[Clean in place:<br/>13 publishers only,<br/>no alternate editions,<br/>unused columns removed]
    Clean --> Small[(Cleaned file)]
    Small --> Load[pgloader]
    Load --> Stage[(gcd_import<br/>holding schema)]
    Stage --> Transform[SQL transform]
    Transform --> DB[(Catalog tables)]
    API[GCD API] -.->|later updates| DB`,
    },
    {
      title: "Catalog data model",
      caption:
        "What the loader imports from GCD. A story is shared content; each printing of it in an issue is a story appearance. Credits and arc membership hang off the appearance, so different printings keep their own attribution.",
      mermaid: `erDiagram
    publisher ||--o{ series : publishes
    series ||--o{ issue : contains
    issue ||--o{ story_appearance : contains
    story ||--|{ story_appearance : "printed as"
    creator }o--o{ story_appearance : "credited on"
    story_appearance }o--o{ story_arc : "part of"
    series }o--o{ series : continues
    publisher {
        string name
        int year_began
        int year_ended
    }
    series {
        string name
        int year_began
        int year_ended
        boolean is_current
        string tags
        string overall_age_rating
        string notes
    }
    issue {
        string number
        int sort_order
        string title
        string cover_date
        int key_date_year
        int on_sale_date_year
        numeric page_count
        string age_rating
        string tags
        string notes
    }
    story {
        string title
        string feature
        string synopsis
        string characters
        string tags
    }
    story_appearance {
        int sequence_number
        numeric page_count
        string title
        string notes
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
    user_profile ||--o{ reading_list : owns
    user_profile ||--o{ reading_map : owns
    user_profile ||--o{ progress : tracks
    reading_list ||--o{ reading_list_item : holds
    reading_map ||--o{ reading_map_list : orders
    reading_list ||--o{ reading_map_list : "included in"
    reading_map ||--o{ reading_map_detour : has
    reading_map_detour }o--|| reading_list_item : "leaves before"
    reading_map_detour }o--|| reading_list : "goes to"
    user_profile {
        string display_name
        string role
        string account_status
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
        "Each shared story has one search entry: the text it is described by, the vector made from that text, and build details. Publisher, series, creator and year filters are not copied onto the entry. They are checked through the story's appearances, so every filter must match the same printing.",
      mermaid: `erDiagram
    story ||--o| search_entry : "described by"
    search_entry {
        int story_id PK
        string text
        string text_hash
        vector embedding "empty until built"
        string embedding_model
        int dimensions
        datetime built_at
        boolean needs_refresh
        boolean has_synopsis
    }`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As a comic reader, I want to describe a story in plain words, so I can find it without knowing the title.",
      criteria: [
        "Results are real stories and issues from the catalog.",
        "Each result links to its issue and series.",
        "Results can be narrowed by publisher, series, creator and year range.",
        'Typing a name like "Batman #497" goes straight to that record.',
      ],
    },
    {
      id: "US-2",
      story:
        "As someone fresh from a comic book movie, I want to search for a character or event I saw, so I can find the comics where it happened.",
      criteria: [
        "A character search ranks the stories whose text mentions that character.",
        "Results show the series and issue of each story.",
        "Results can be filtered to one publisher.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a reader, I want to browse a publisher's history by date, so I can see what was published when and find stories from a particular period.",
      criteria: [
        "Search can be limited to a year range, using each issue's on-sale year, or its key-date year when there is no on-sale date.",
        "Dates show the precision GCD records: a year, a year and month, or a full date.",
        "Issues with no date stay in the catalog and are left out of year-range results.",
        "A series is found by name and lists its issues in order.",
      ],
    },
    {
      id: "US-4",
      story:
        "As a reader, I want to open a story and see where it was published and what comes next.",
      criteria: [
        "The page shows the series, issue number as printed, date, creators with their roles, characters and story arcs.",
        "Each story is returned once, with its matching appearances. A reprint is another appearance of the same story, not a duplicate result.",
        "The page offers the next issue in the series, the next story in the story arc, and the series that continues this one.",
        "What comes next is worked out by rules from the data.",
      ],
    },
    {
      id: "US-5",
      story:
        "As a reader, I want to plan my reading with ordered lists and maps, so I know what to read and in what order.",
      criteria: [
        "A list holds series, issues or stories, each optionally marked essential, recommended, optional or skippable.",
        "A list is private or public by link, and only its owner can change it.",
        "A map groups lists in order, with detours that say where a reader leaves a list and whether they come back.",
      ],
    },
    {
      id: "US-6",
      story: "As a reader, I want to track what I have read.",
      criteria: [
        "An item's status is planned, in progress, completed or skipped.",
        "Completing an issue marks it completed everywhere it appears.",
        "Each item has one status per user.",
      ],
    },
    {
      id: "US-7",
      story:
        "As a reader, I want a warning when an issue or series may contain mature content, so I can decide whether I can read it with my children.",
      criteria: [
        "Every issue and series carries a rating of SFW, NSFW or Unknown.",
        'Mature content stays in search results and on its pages, with a "may contain mature content" warning.',
        "A series is NSFW if any of its issues is NSFW, and SFW only when every issue is SFW.",
        "Issues without enough evidence show as Unknown.",
        "Ratings come from the printed rating and a reviewed list of content tags, using fixed rules.",
      ],
    },
  ],
  decisions: [
    {
      title: "Comics only",
      context:
        "Movies, television and games are far better covered by existing databases than comics are, so the gap StarChart fills is in comics. A guide across every medium would also need a data model general enough for any medium and several sources to keep matched to each other.",
      choice:
        "StarChart covers comics only: 13 publishers including DC, Marvel, Image, Dark Horse and BOOM! Studios. The data model is built around publishers, series, issues and stories instead of a model that fits any franchise or medium.",
      tradeoff:
        "A comics-only focus keeps the data model small and the catalog deep. Readers arriving from a film or show find the comics by searching for a character or event.",
    },
    {
      title:
        "Load the catalog from the Grand Comics Database dump, then update from its API",
      context:
        "Catalog data could come from outside providers through their APIs, each with its own availability, rate limits and caching terms. The GCD dump is complete, but a new dump is a heavy way to pick up small changes.",
      choice:
        "The catalog is seeded once from the GCD data dump, an SQLite file of about 6.75 GB, limited to the 13 publishers StarChart covers. After that first load, the GCD API supplies additions and corrections, matched to existing records by their GCD ID. Newer dumps are not reloaded.",
      tradeoff:
        "The catalog follows GCD's coverage and stays current through its API. Downloading the dump needs a free GCD account.",
    },
    {
      title: "Clean the dump, load it with pgloader, transform it with SQL",
      context:
        "The raw dump holds every publisher, deleted records, alternate editions and hundreds of columns StarChart never uses. Loading all of it into the app database would be slow and would mix source data with app data.",
      choice:
        "A Python script cleans the downloaded SQLite file: it keeps only the 13 publishers, removes deleted records and alternate editions, drops unused tables and columns, and normalizes text and dates. pgloader then copies the cleaned file into a separate holding schema in Postgres, and SQL builds the catalog tables from it, so the app tables are built from clean, staged data.",
      tradeoff:
        "Cleaning in place keeps one working file and cuts the load to about 0.37 GB. A change to the cleaning rules starts again from a fresh download, and the holding schema is rebuilt on each import.",
    },
    {
      title: "Search by meaning with embeddings",
      context:
        "Finding a story by what happens in it is the center of the product, and most catalog databases are built for lookups by name.",
      choice:
        'Each shared story gets a search entry: text built by formatting its fields in a fixed order, and a vector made from that text by an embedding model. A query is turned into a vector by the same model, filters narrow by publisher, series, creator and year range, and the nearest entries come back as real records. Full-text search handles exact lookups such as "Batman #497".',
      tradeoff:
        "Results get richer as GCD adds synopses: about 53% of comic stories have one today, and under 1% link to a story arc. Each entry stores its model name and a fingerprint of its text, so a model change can rebuild entries automatically.",
    },
    {
      title: "Model stories and their appearances",
      context:
        "GCD records credits per story, and one issue can hold a main story and backups, so the story is the natural unit to search. GCD also records reprints, collected editions and alternate covers alongside the original material, and each printing can carry different credits.",
      choice:
        "Every comic story in an issue becomes a story appearance. Appearances that GCD confirms are complete reprints of the same story share one story record, so search returns the story once with its printings. Collected editions and separate reprint publications are kept as issues. Alternate editions of the same issue, such as variant covers, are left out, along with series GCD flags as not comics publications.",
      tradeoff:
        "Grouping appearances only on confirmed evidence keeps each story's identity reliable, so some reprints stay separate stories until GCD confirms them. Characters are matched through story text, which keeps the model simple.",
    },
    {
      title: "Warn about mature content",
      context:
        "GCD includes mature material, and most issues have no printed rating. A reader should be warned before opening mature content, while every record stays available.",
      choice:
        "Each issue and each series gets a rating of SFW, NSFW or Unknown, worked out from the printed GCD rating and a reviewed list of content tags and genres by fixed rules. Teen and Teen Plus count as SFW. Mature, 17+, 18+, nudity and erotica evidence counts as NSFW and overrides a SFW rating. A series is NSFW if any issue is, and SFW only if every issue is. NSFW records stay visible with a warning, and each result keeps the rule that produced it.",
      tradeoff:
        "Most older issues have no printed rating and show as Unknown rather than being guessed. The reviewed lists grow as new labels turn up.",
    },
  ],
};
