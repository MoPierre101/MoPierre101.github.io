import type { Project } from "@/types/project";

export const starchart: Project = {
  id: "starchart",
  title: "StarChart",
  date: { start: "September 2026", end: "Present" },
  summary:
    "A data pipeline that cleans the Grand Comics Database into a Postgres database for 13 publishers of US comics, with a read-only search API on top.",
  overview: {
    problem:
      "The Grand Comics Database (GCD) is a community-built archive of comics from every publisher in the world. Its download is about 6.7 GB and isn't ready to use as it stands. It includes deleted entries and columns nobody needs. Some dates are incomplete, like 2000-06-00, which Postgres can't store. Text carries placeholder marks and invisible characters. Some credits point at people who aren't in the download. StarChart keeps 13 publishers, cleans their data with SQL, and loads it into a Postgres database that is ready to query. It has tables for series, issues, stories, creators and characters. A search API sits on top.",
    users: [
      "App developers who need a clean, narrow comics catalog to build on",
      "Analysts who want to query comics publishing history in SQL",
    ],
    stack: [
      "Python",
      "SQLite",
      "pgloader",
      "PostgreSQL",
      "SQL",
      "pg_trgm",
      "Encore.ts",
      "TypeScript",
      "Prisma",
      "Vitest",
      "uv",
    ],
    links: [
      { label: "GitHub", url: "https://github.com/MoPierre101/starchart" },
    ],
  },
  diagrams: [
    {
      title: "Catalog loading pipeline",
      caption:
        "How the catalog gets into the database. The full Grand Comics Database (GCD) download is stripped down to the 13 publishers StarChart covers, loaded into a temporary copy in Postgres with pgloader, and cleaned with SQL into the gcd tables, which the search API reads. The file shrinks from about 6.7 GB to about 620 MB.",
      mermaid: `flowchart LR
    Dump[(Full GCD download<br/>6.7 GB)] --> Strip[Strip to<br/>13 publishers]
    Strip --> Small[(stripped.db<br/>620 MB)]
    Small --> Load[pgloader]
    Load --> Raw[(gcd_raw<br/>temporary)]
    Raw --> Clean[SQL clean]
    Clean --> Gcd[(gcd<br/>clean tables)]
    Gcd --> Api[Encore.ts<br/>search API]`,
    },
    {
      title: "Catalog data model",
      caption:
        "The cleaned GCD tables. A series holds issues, and an issue holds stories. A variant (alternate cover) points back to its regular issue. Credits and characters attach to the story, and reprints link a story or issue to the one it reprints.",
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
        "As an app developer, I want to search issues by what a user types, so I can find an issue from a series name, year, number or title.",
      criteria: [
        "Search matches what the user types against one line per issue: series name, series start year, issue number, issue year and title. Partial names still find it.",
        "Results can be narrowed by format (single issue, collection or graphic novel), publisher and year range.",
        "Variant covers don't appear as separate results.",
        "Results come in pages. Each response says how to fetch the next page, and says nothing on the last page.",
      ],
    },
    {
      id: "US-2",
      story:
        "As an app developer, I want to search creators and characters by any name, so an alias or pen name still finds the right record.",
      criteria: [
        "A creator or character matches on its official name or any other name.",
        "A creator or character result shows the other name that matched.",
      ],
    },
    {
      id: "US-3",
      story:
        "As an app developer, I want one call that returns the top results of each kind, so a search bar can show a dropdown.",
      criteria: [
        "One call returns the top five issues, creators and characters.",
        "The text must be 3 to 100 characters.",
      ],
    },
    {
      id: "US-4",
      story:
        "As an analyst, I want a rating on every issue, so I can tell all-ages comics from mature ones.",
      criteria: [
        "Every issue shows a rating: all ages, comics code, teen, mature, other or unknown.",
        "Issues with no rating signal show unknown, never a guess.",
      ],
    },
    {
      id: "US-5",
      story:
        "As the maintainer, I want one script that rebuilds the catalog from a new download, so the data can be refreshed without hand-fixing.",
      criteria: [
        "One run strips, loads and cleans the download.",
        "Each run rebuilds the clean tables from scratch.",
      ],
    },
  ],
  decisions: [
    {
      title: "Use the GCD download as the single source of truth",
      context:
        "Catalog data could come from several providers, each with its own id numbers and terms, and their records would need matching to each other.",
      choice:
        "The Grand Comics Database supplies series, issues, stories, creators and characters under one set of id numbers, so there is no matching step. A one-time download seeds the catalog, and the data is credited to the GCD.",
      tradeoff:
        "The catalog follows GCD's coverage, which is uneven. Of 519,817 comic stories in the stripped download, 148,870 (29%) have a synopsis of 100 characters or more.",
    },
    {
      title: "Limit the catalog to 13 publishers",
      context:
        "The download covers every publisher, language and publication type, and most of it is not the comic content StarChart is for.",
      choice:
        "The pipeline keeps 13 publishers, English, Spanish and French only, and comic, text, cartoon and photo stories. It drops non-comics, giveaway, promo and ashcan series (799 series and 1,839 issues). The download shrinks from about 6.7 GB to about 620 MB.",
      tradeoff:
        "A smaller catalog loads and searches quickly. Choosing publishers one by one rather than by country keeps Titan, which GCD lists as a UK publisher.",
    },
    {
      title: "Build a step-by-step pipeline that can be rerun",
      context:
        "The raw download holds deleted rows, unused columns, and inconsistent dates, text and credits.",
      choice:
        "The pipeline trims the download to the 13 publishers, loads it into a temporary copy in Postgres with pgloader, cleans it with SQL into gcd, and deletes the temporary copy.",
      tradeoff:
        "Each cleaning rule lives in one place and can rerun without reloading. Changing the trimming rules means starting over from a fresh download.",
    },
    {
      title: "Keep only rows that link to kept data",
      context:
        "GCD entries can refer to entries missing from the download, and the database's link check would reject them.",
      choice:
        "Credits that name a missing creator (23,959 story credits and 7,323 issue credits) and character appearances that name a missing character (71,097) are dropped. Reprints are kept only when both issues are kept. The 156 series bonds and 13 story-arc relations with one end outside the kept data are dropped.",
      tradeoff:
        "Every kept link points at something that is kept, so the database can enforce its links. Links to anything outside the 13 publishers, mostly foreign editions, are lost.",
    },
    {
      title: "Tag each issue as single issue, collection or graphic novel",
      context:
        "Reprint links alone mislabel reprint one-shots as collections and miss original material in collections.",
      choice:
        'The format text GCD volunteers enter is lowercased. A series whose format contains "collected" is a collection. A series whose format contains "graphic novel", or an issue that has an ISBN (a book number) and a book-style binding and isn\'t already a collection, is a graphic novel. Everything else is a single issue.',
      tradeoff:
        "Search can filter by format. The rule depends on how volunteers word that text.",
    },
    {
      title: "Keep variants, search regular issues only",
      context:
        "Alternate covers are separate records in GCD, and they would flood search results.",
      choice:
        "Every variant is kept and linked to its regular issue. Search returns regular issues only.",
      tradeoff:
        "Keeping variants preserves reprint links. Variant credits that merely copy the regular issue's are dropped.",
    },
    {
      title: "Store a rating on every issue and story",
      context:
        "Most issues have no printed rating, and the tags that could signal mature content were too weak to rely on.",
      choice:
        "Every issue and story gets a rating (all ages, comics code, teen, mature, other or unknown) worked out from the printed rating and the story's genre.",
      tradeoff:
        "Unrated issues show unknown instead of a guess. Anyone reading the data can draw their own line between ratings.",
    },
    {
      title: "Store dates in parts, with how exact they are",
      context:
        "GCD dates can be a year only, a month with no day, or a value like 2000-06-00 that Postgres can't store.",
      choice:
        "Cover and on-sale dates become separate year, month and day numbers, plus a note of how exact the date is (year only, year and month, or full date) and a date that can be sorted. An invalid day is left blank and the month is kept.",
      tradeoff:
        "The data keeps what GCD actually knows without inventing a day. Issues with no usable date stay in the catalog but drop out of date-based views.",
    },
    {
      title: "Store one search line on each issue",
      context:
        'A user types things like a series name and a number, such as "batman 2016 50". The pieces of an issue\'s name live in different tables: the series name and start year, the issue number, the issue year and the title.',
      choice:
        'When the pipeline builds the gcd.issue table, it also fills a search_text column with the series name, series start year, issue number, issue year and title, for example "Batman 2016 #50 2018 The Wedding". Search compares what the user types against that one line, using pg_trgm, a Postgres extension for matching partial and similar text. Creator names, their other names, character names and their other names are matched the same way, with indexes that keep it fast.',
      tradeoff:
        "The line repeats information held in other tables and is rebuilt on every pipeline run. In exchange, matching works against one indexed column instead of several tables.",
    },
    {
      title: "Serve reads from one Encore.ts service",
      context:
        "The cleaned data is only useful if clients can read it without writing their own SQL.",
      choice:
        "One Encore.ts service, catalog, offers the search endpoints and rejects any request that doesn't fit the expected shape. It reads the database through Prisma, and the search queries are written directly in SQL.",
      tradeoff:
        "The endpoints only read. Each page is fetched by skipping the results already shown.",
    },
  ],
};
