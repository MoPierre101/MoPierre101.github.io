import type { Project } from "@/types/project";

export const teleshow: Project = {
  id: "teleshow",
  title: "TeleShow",
  date: { start: "February 2025", end: "May 2025" },
  summary:
    "Find movies and TV shows like the ones you're watching, see where to stream them, and keep watchlists, progress and a release calendar.",
  overview: {
    problem:
      "People who finish a movie or show often want more like it, and want to know which of their streaming services carries it. Keeping track of what to watch and when new episodes arrive usually means juggling several sites and lists. TeleShow brings search, recommendations by streaming platform, watchlists, episode tracking and a release calendar into one place.",
    users: [
      "A guest who browses, searches and sees where to stream a title without an account",
      "A viewer who wants to know which streaming service carries a movie or show",
      "A viewer who tracks a show episode by episode and season by season",
      "A viewer who organizes titles into named watchlists, with a status on each",
      "A viewer who wants recommendations that adapt to what they follow and the streaming services they have",
      "A viewer who wants to know when new episodes or films come out",
    ],
    stack: [
      "React",
      "Python",
      "Flask",
      "Firebase Firestore",
      "TMDB API",
      "Watchmode API",
      "sentence-transformers",
      "PyInstaller",
      "Recharts",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/MoPierre101/TeleShow",
      },
    ],
  },
  diagrams: [
    {
      title: "System overview",
      caption:
        "The React app only talks to the Flask backend. The backend talks to TMDB, Watchmode and Firestore, keeps an in-memory copy of each user's data, and runs the embedding model.",
      mermaid: `flowchart LR
    App[React app] --> API[Flask backend]
    API --> TMDB[TMDB API]
    API --> Watchmode[Watchmode API]
    API --> Cache[(Response cache<br/>on disk)]
    API --> Model[Embedding model]
    API --> Memory[(In-memory copies<br/>of user data)]
    API -->|writes| Firestore[(Firebase Firestore)]
    Firestore -->|real-time listeners| Memory`,
    },
    {
      title: "Firestore data model",
      caption:
        "Each user has subcollections for watchlists, followed media, TV progress, calendar entries and learned interests. Each watchlist holds its own media, and each title has one of five statuses: plan to watch, watching, on hold, stopped or finished. A show's progress holds its seasons and, for each episode, a watched flag and timestamp.",
      mermaid: `erDiagram
    user ||--o{ watchlist : owns
    watchlist ||--o{ watchlist_media : holds
    user ||--o{ followed_media : follows
    user ||--o{ tv_progress : tracks
    user ||--o{ calendar_entry : has
    user ||--o| learned_interests : builds
    watchlist_media {
        string status
    }
    followed_media {
        string genres
        string keywords
        string production_companies
    }
    tv_progress {
        string seasons
        boolean watched
        datetime watched_at
    }
    calendar_entry {
        string next_episode
        date release_date
    }
    learned_interests {
        string genres
        string keywords
        string production_companies
    }`,
    },
    {
      title: "Search",
      caption:
        "Movie and TV lookups run at the same time on separate threads. When a streaming platform is chosen, each title gets its own provider lookup.",
      mermaid: `flowchart LR
    Query[Query and filters] --> Movies[Movie search<br/>own thread]
    Query --> TV[TV search<br/>own thread]
    Movies --> Merge[Merge results]
    TV --> Merge
    Merge --> Platform[If a platform is chosen<br/>look up providers per title<br/>in a thread pool, keep matches]
    Platform --> Score[Score by match, recency,<br/>vote and popularity]
    Score --> Results[Ranked results]`,
    },
    {
      title: "Similar-title recommendations",
      caption:
        "A pool of candidates is scored and cut to the top 100, then re-scored with the embedding model, genre overlap, keyword overlap and popularity.",
      mermaid: `flowchart LR
    Source[Source title] --> Pool[Candidate pool<br/>genre, keyword and company<br/>searches run in parallel]
    Pool --> First[Score by popularity, vote,<br/>genres and release year<br/>keep the top 100]
    First --> Final[Final score<br/>genre 35%, text 30%,<br/>keyword 25%, popularity 10%]
    Final --> Language[Drop other languages]
    Language --> Top[Return the top 24]`,
    },
    {
      title: "Personalized recommendations",
      caption:
        "Built from the genres, keywords and production companies of the titles a user follows. Anything already followed or on a watchlist is removed.",
      mermaid: `flowchart LR
    Follows[Titles the user follows] --> Interests[Interest profile<br/>genres, keywords, companies]
    Interests --> MoviePool[Movie pool]
    Interests --> TVPool[TV pool]
    MoviePool --> Remove[Remove titles already followed<br/>or on a watchlist]
    TVPool --> Remove
    Remove --> Narrow[Optionally narrow to the<br/>chosen streaming platforms]
    Narrow --> Sort[Sort by popularity]`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As a guest, I want to browse and search without an account, so I can see what's available before signing up.",
      criteria: [
        "The landing page has carousels of trending movies and popular TV that scroll on their own and pause when I point at them.",
        "I can search with a filter for all content, movies or TV.",
        "I can open any title to see its overview, cast, trailers, images and where to watch.",
        "Explicit content is not displayed.",
        "Following, ratings and watchlists ask me to log in.",
      ],
    },
    {
      id: "US-2",
      story:
        "As a viewer, I want to know which streaming services carry a title, so I know where to watch it.",
      criteria: [
        "Each title lists the US services that carry it, once per service, type and price, where the type is subscription, rent or buy.",
        "When I am signed in, I can filter search results to my chosen services.",
        "A title counts as on a service under any of that service's listings. Netflix, for example, has several.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a viewer, I want to track a show episode by episode, so I know where I left off.",
      criteria: [
        "The Episodes tab lists every season and episode with a checkbox, and skips the specials season.",
        "Each season has a progress bar.",
        "One button marks a whole season watched or unwatched.",
        "My progress is saved and counts toward my stats.",
      ],
    },
    {
      id: "US-4",
      story:
        "As a viewer, I want named watchlists with a status on each title, so I can organize what to watch.",
      criteria: [
        "A list is created by name when I first add a title to it, and duplicates are refused.",
        "New titles start as Plan to watch. The other statuses are Watching, On hold, Stopped and Finished, and titles are sorted by status.",
        "I can view one list or all of them together.",
        "I can remove a title, and I am asked which list when it is on several.",
        "A list is deleted only after I confirm.",
      ],
    },
    {
      id: "US-5",
      story:
        "As a viewer, I want recommendations that adapt to what I follow, so I find more like what I enjoy.",
      criteria: [
        "Any title has a Similar tab that loads similar titles on demand.",
        "Following a title adds its genres, keywords and production companies to my interests, and unfollowing removes the ones with no remaining source.",
        "My recommendations leave out titles I follow or have on a watchlist.",
        "I can narrow my recommendations to my streaming platforms.",
      ],
    },
    {
      id: "US-6",
      story:
        "As a viewer, I want to know when new episodes or films come out, so I don't miss them.",
      criteria: [
        "Following an ongoing show records its next episode, and following an unreleased film records its release date.",
        "The calendar groups upcoming episodes and releases by date.",
        "A refresh button updates them.",
        "Finished shows and released films drop off.",
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
      title: "A Flask backend, separate from the React frontend",
      context:
        "The heavy work, such as embeddings, scoring and parallel calls to TMDB, would slow everything down if it ran in the browser. Python was also the more familiar language at the time, and a framework that runs code on the server, like Next.js, was still unfamiliar.",
      choice:
        "A Flask API in Python sits between the React frontend and three outside systems: TMDB, Watchmode and Firestore. The backend holds the heavy logic, the embedding model, the scoring and the caching, and the frontend asks for results.",
      tradeoff:
        "Two codebases in two languages, and a server that has to be running.",
    },
    {
      title: "One packaged executable, with a file-system cache",
      context:
        "TeleShow is deployed as an executable, which means one user per installation.",
      choice:
        "PyInstaller bundles the Flask server and the compiled React app into one executable, and batch scripts build the frontend, copy it into the backend and bundle everything. The server's cache is kept in the file system instead of memory. The configuration detects whether it is running as a script or as an executable, so file paths, API keys and Firebase credentials resolve in both.",
      tradeoff:
        "A file cache is slower than memory and is not shared between copies of the app, which only works because each installation has one user.",
    },
    {
      title: "Real-time Firestore listeners with in-memory copies",
      context: "Querying Firestore on every request made lookups slow.",
      choice:
        "Real-time listeners keep in-memory copies of each user's profile, ratings, comments, watchlists, followed titles and TV progress. Each listener applies only the changes Firestore reports. Watchlists have nested listeners for the titles inside each list, attached and removed as lists are created or deleted. A handler waits for the first snapshot, so the first request gets real data.",
      tradeoff:
        "The listeners have to be managed. Locks guard the shared caches, a guard stops the same user from being set up twice, a background thread checks every five minutes for closed connections and recreates them, and shutdown handlers clear the caches and unsubscribe every listener.",
    },
    {
      title: "A lightweight pre-trained embedding model for similar titles",
      context:
        "Similar titles need more than matching genre tags, because the plot overview carries meaning too. A model that gives accurate results without being trained on movie data keeps the project simple.",
      choice:
        "A pre-trained, lightweight model, sentence-transformers/static-similarity-mrl-multilingual-v1, turns titles and overviews into embeddings, and cosine similarity measures how close each candidate is to the source title. It loads in a background thread at startup so it never delays the server. The text score is combined with genre overlap and keyword overlap, both measured with Jaccard similarity, and a small popularity factor, using fixed weights of 35% genre, 30% text, 25% keyword and 10% popularity. Titles in a different language are dropped and the top 24 are returned.",
      tradeoff:
        "The model is not tuned on movie data, and the weights are fixed by hand, not learned.",
    },
    {
      title: "Content-based recommendations",
      context:
        "To recommend a title, something has to decide which titles fit a user. Approaches based on other users' behavior need a lot of interaction data, and they can't suggest a title nobody has interacted with yet.",
      choice:
        "Recommendations are content-based. A title is scored from its own attributes, which are genres, keywords, production companies and overview text, together with what the user follows. Other users' behavior is not used. This applies to recommendations only, and search results use their own relevance score.",
      tradeoff:
        "It can only suggest titles that resemble what the user already follows, and it depends on the quality of the attributes TMDB has for each title.",
    },
    {
      title: "Two kinds of recommendations",
      context:
        "A viewer asks two different questions: what is similar to this title, and what should I watch next.",
      choice:
        "Similar-title recommendations start from one source title. Personalized recommendations start from the genres, keywords and production companies a user has accumulated by following titles. They build a movie pool and a TV pool, remove everything the user already follows or has on a watchlist, optionally narrow the results to the user's streaming platforms, and sort by popularity. Both draw candidates from a shared function that searches TMDB by genre, keyword and production company in parallel and falls back to highly rated titles in the same primary genre when the pool is too small.",
      tradeoff: "Two code paths to maintain, built on one shared pool.",
    },
    {
      title: "Platform-specific results through grouped provider IDs",
      context:
        "A single streaming service often appears under several provider IDs on TMDB. Netflix, for example, has three.",
      choice:
        "A map groups the IDs under each service, such as Netflix, Hulu, Disney+, Amazon, Max, Paramount, Apple and Peacock, and a title matches if any of the IDs is present. The same mapping filters search results and recommendations. Each candidate needs its own provider lookup, so the lookups run in a thread pool with a timeout.",
      tradeoff:
        "One extra lookup for every candidate title, and the map is kept up to date by hand.",
    },
    {
      title: "A direct HTTP call for watch providers",
      context:
        "The tmdbsimple wrapper sometimes returned nothing for the watch-provider call.",
      choice:
        "That one call was replaced with a direct HTTP request to the TMDB API, and providers are deduplicated across subscription, rental and purchase offers.",
      tradeoff:
        "More boilerplate and less cohesion, because one call no longer goes through the same wrapper as the rest.",
    },
  ],
};
