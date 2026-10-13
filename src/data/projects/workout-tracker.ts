import type { Project } from "@/types/project";

export const workoutTracker: Project = {
  id: "workout-tracker",
  title: "Workout Tracker",
  date: {
    start: "October 2024",
    end: "December 2024",
  },
  summary: "JavaFX fitness application with dedicated exercise video library.",
  overview: {
    problem:
      "Gym goers needed a central place to find exercise demonstrations that could help them understand movements and work toward better workout form. The video library addressed this need through browsing, search, and playback within the fitness application.",
    users: [
      "Gym goers looking for visual exercise demonstrations",
      "Users browsing beginner, intermediate, or advanced exercises",
      "Users looking for upper-body, core, or lower-body exercises",
    ],
    stack: ["Java", "JavaFX", "Firebase Storage", "Maven"],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/MoPierre101/PersonalFitnessTracker",
      },
    ],
  },
  diagrams: [
    {
      title: "Video discovery and playback",
      caption:
        "The controller lists Firebase Storage objects, filters them by category or search term, and passes a media URL to the JavaFX player. This diagram covers my video-library contribution.",
      mermaid:
        "flowchart TD\n  A[Exercise library] --> B[Choose level and body area]\n  A --> C[Enter search term]\n  B --> D[VideosController]\n  C --> D\n  D --> E[List objects in Firebase Storage]\n  E --> F[Filter by type metadata or filename]\n  F --> I[Construct Firebase media URLs]\n  I --> G[Display selectable video results]\n  G --> H[Select a demonstration]\n  H --> J[JavaFX MediaPlayer]\n  K[Firebase-hosted MP4] -->|Media URL| J\n  J --> L[Watch, pause, resume, and loop]\n  L --> M[Back to previous results]",
    },
  ],
  stories: [
    {
      id: "US-01",
      story:
        "As a gym goer, I want to browse exercises by difficulty and body area so that I can find demonstrations relevant to my workout.",
      criteria: [
        "The library offers Beginner, Intermediate, and Advanced levels.",
        "Each level offers Upper, Core, and Lower categories.",
        "Selecting a category displays MP4 videos whose type metadata matches that category.",
        "The selection list is scrollable and each video has a selectable name.",
      ],
    },
    {
      id: "US-02",
      story:
        "As a gym goer who knows an exercise name, I want to search the library so that I can find its demonstration without browsing every category.",
      criteria: [
        "UI has search field for users to search catalog.",
        "Search matches text within stored video filenames without regard to letter case.",
        "Matching videos appear as selectable results in a scrollable list.",
        "A search with no matches displays 'No Results Found'.",
      ],
    },
    {
      id: "US-03",
      story:
        "As a gym goer, I want to watch a selected demonstration inside the application so that I can review the movement from the same place I found it.",
      criteria: [
        "Selecting a video from a category or search result opens the in-app player.",
        "The player loads the selected video using a Firebase Storage media URL.",
        "Playback starts when the media player is ready.",
        "The video preserves its aspect ratio and displays playback progress.",
      ],
    },
    {
      id: "US-04",
      story:
        "As a gym goer learning a movement, I want to pause, resume, and repeatedly watch a demonstration so that I can review it at my own pace.",
      criteria: [
        "Selecting Pause pauses active playback and changes the button label to Play.",
        "Selecting Play resumes playback and changes the label to Pause.",
        "When the video ends, it returns to the beginning and plays again automatically.",
      ],
    },
    {
      id: "US-05",
      story:
        "As a gym goer comparing exercises, I want to return from a video to my previous results so that I can choose another demonstration without repeating my search or category selection.",
      criteria: [
        "The player provides a Back button.",
        "Selecting Back stops and disposes of the active media player.",
        "Back restores the saved result content, window title, and window dimensions.",
        "The restored result list provides selectable videos.",
      ],
    },
  ],
  decisions: [
    {
      title:
        "Stream Firebase-hosted videos instead of requiring advance downloads",
      context:
        "I wanted gym goers to watch exercise demonstrations without having to download video files to their devices before viewing them.",
      choice:
        "I chose Firebase Storage to host the MP4 videos and built URL-based playback in JavaFX. The controller constructs media URLs from object names and download-token metadata and passes them to MediaPlayer.",
      tradeoff:
        "Users can watch without managing video downloads in advance, but streaming depends on internet access, storage availability, and valid media URLs.",
    },
    {
      title: "Organize browsing by difficulty and body area",
      context:
        "Users may know their workout focus even when they do not know a specific exercise name.",
      choice:
        "Provide nine category combinations: Beginner, Intermediate, and Advanced, each with Upper, Core, and Lower options.",
      tradeoff:
        "A small, predictable set of categories makes browsing straightforward, but adding categories requires controller and interface changes.",
    },
    {
      title: "Use storage folders and metadata as the category catalog",
      context:
        "A key technical challenge was accessing the Firebase-hosted videos and mapping each storage folder to the correct category in the exercise library.",
      choice:
        "I mapped folder prefixes such as bu/ and ic/ to type metadata during initialization, then used that metadata to filter videos for each category and generated selection buttons from the filenames.",
      tradeoff:
        "This connects stored files directly to the library without a separate video-catalog database, but depends on consistent naming and adds storage reads and metadata writes during initialization.",
    },
    {
      title: "Search filenames using case-insensitive text matching",
      context:
        "Users who know an exercise name need a direct way to find it across categories.",
      choice:
        "List stored video objects and compare lowercased filenames with the lowercased search term, then display matches or a no-results message.",
      tradeoff:
        "The implementation is simple for a small library, but scans the bucket on each search and relies on filenames rather than descriptions, synonyms, or ranked results.",
    },
    {
      title: "Keep playback and repeat viewing inside JavaFX",
      context:
        "Reviewing an exercise demonstration requires control over viewing pace and a way to continue browsing afterward.",
      choice:
        "Use MediaPlayer and MediaView with pause/resume, a progress indicator, automatic looping, and saved result state for Back navigation.",
      tradeoff:
        "Users can review demonstrations within the application, but the controller must manage playback resources and navigation state. The implemented controls do not include seeking or playback-speed adjustment.",
    },
  ],
};
