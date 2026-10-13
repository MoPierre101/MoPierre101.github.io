import type { Project } from "@/types/project";

export const scndcom: Project = {
  id: "scndcom",
  title: "ScndCom",
  date: { start: "June 2026", end: "August 2026" },
  summary:
    "Turn spoken or typed requests into formatted Google Docs, with an editable transcript that lets you check what was heard before creating a document.",
  overview: {
    problem:
      "Some people would rather make notes by speaking than typing. ScndCom lets them speak a request, check and fix what the browser heard, and have it turned into a formatted Google Doc in their own Drive.",
    users: [
      "People who want to make notes by voice",
      "People whose accent or speech impediment makes speech recognition unreliable, so they need to correct what was heard",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "BAML",
      "OpenAI",
      "Google Drive API",
      "Web Speech API",
      "Clerk",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/fs-apprenticeship/ScndCom",
      },
    ],
  },
  diagrams: [
    {
      title: "From a spoken request to a Google Doc",
      caption:
        "A request can be spoken or typed. Either way it passes through the review step before anything is sent.",
      mermaid: `flowchart LR
    Speak[Speak<br/>Web Speech API] --> Review[Review and edit<br/>the transcript]
    Type[Type instead] --> Review
    Review -->|confirm| Classify[Classify the request<br/>BAML and OpenAI]
    Classify -->|document| Write[Write the note as Markdown<br/>BAML and OpenAI]
    Classify -->|anything else| Other[Handled by the<br/>other features]
    Write --> Upload[Upload to Google Drive<br/>labeled as Markdown]
    Upload --> Doc[Google Doc in the<br/>user's own Drive]`,
    },
    {
      title: "Creating a document, step by step",
      caption:
        "The Drive upload creates the document and fills it with formatted content in one request.",
      mermaid: `sequenceDiagram
    actor User
    participant Dash as Dashboard
    participant Intent as Intent route
    participant Doc as Document route
    participant Clerk
    participant LLM as BAML and OpenAI
    participant Drive as Google Drive API
    User->>Dash: Speak or type a request
    Dash->>User: Show the transcript to review
    User->>Dash: Edit and confirm
    Dash->>Intent: Send the transcript
    Intent->>LLM: ParseIntent
    LLM-->>Intent: Category and summary
    Intent-->>Dash: Document request
    Dash->>Doc: Send the transcript
    Doc->>Clerk: Get the user's Google access token
    Clerk-->>Doc: Token
    Doc->>LLM: CreateGDoc
    LLM-->>Doc: Title and Markdown content
    Doc->>Drive: One multipart upload
    Drive-->>Doc: New document id
    Doc-->>Dash: Link to the document
    Dash-->>User: Show the link`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As someone who prefers to speak my notes, I want to say a request and see it written out, so I don't have to type it.",
      criteria: [
        "I can start and stop listening.",
        "A live waveform shows when it is listening.",
        "My words appear on screen as I speak.",
        "If my browser doesn't support speech recognition, I am told and can type my request instead.",
      ],
    },
    {
      id: "US-2",
      story:
        "As someone whose accent or speech impediment trips up speech recognition, I want to fix what was misheard before anything runs.",
      criteria: [
        "The transcript opens in a box I can edit.",
        "Nothing is sent until I confirm.",
        "I can cancel instead of confirming.",
        "I can type a request from scratch instead of speaking.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a note taker, I want my request turned into a Google Doc, so my notes are formatted and saved in my own Drive.",
      criteria: [
        "The request is classified before anything is created.",
        "The document gets a title and content with headings, bold text and bullets.",
        "I get a link to open the finished document.",
        "If something fails, an error says what went wrong.",
      ],
    },
    {
      id: "US-4",
      story:
        "As a user, I want to sign in, so my documents are created in my own Google account.",
      criteria: [
        "Sign in and sign up appear when I am signed out, and my account menu appears when I am signed in.",
        "A request from someone who is not signed in is rejected.",
        "The document is created with my own Google access.",
      ],
    },
  ],
  decisions: [
    {
      title: "Create documents through the Drive API instead of the Docs API",
      context:
        "The language model writes notes in Markdown. The Docs API doesn't accept Markdown: creating a document only makes an empty one, and the content has to be added afterward through a batch of separate requests, each one inserting text or styling a range of characters.",
      choice:
        "One multipart upload to the Drive API. The first part says the file is a Google Doc, and the second part is labeled as Markdown, which makes Drive's importer turn headings, bold text and bullets into Google Docs formatting. The document is created and filled in a single request, replacing the two-step create-then-update flow.",
      tradeoff:
        "The content has to go through Drive before it becomes a Doc, so the app needs Drive access, and Drive's importer decides how the Markdown is formatted.",
    },
    {
      title: "BAML with OpenAI models for typed, structured responses",
      context:
        "The app needs more than text back from the model. A document needs a title and Markdown content, and a request needs a category. Free-form replies would have to be parsed by hand and could come back in the wrong shape.",
      choice:
        "BAML functions describe the shape of each response as a class, such as a document with a title, Markdown content and topics, or an intent with a category and a one-line summary. The functions call OpenAI models and return typed objects, which the Next.js API routes pass on to the app.",
      tradeoff:
        "The app depends on BAML and on OpenAI, and BAML generates the TypeScript client code that the app imports.",
    },
    {
      title: "Show the transcript for review before anything runs",
      context:
        "Browser speech recognition, the Web Speech API, is less reliable for accents and speech impediments. A misheard word would otherwise go straight into a document.",
      choice:
        "After speaking, a dialog shows the transcript in an editable box. The request is only sent when the user confirms, and the user can cancel or type a request from scratch.",
      tradeoff:
        "Every request takes an extra step, even when the browser heard it correctly.",
    },
    {
      title: "Classify the request before acting on it",
      context:
        "One voice box can receive more than one kind of request, so the app has to know what the user wants before it does anything.",
      choice:
        "A BAML function reads the confirmed transcript and returns a category and a one-line summary. The dashboard then calls the matching feature's API route, and anything that isn't clearly a known kind of request is marked unknown. Document requests go to document creation.",
      tradeoff:
        "A document request makes two model calls, one to classify and one to write the note, and a misclassified request goes to the wrong feature.",
    },
    {
      title: "Don't commit the generated BAML generated client",
      context:
        "BAML generates a TypeScript client from the model files. With three teammates each committing generated copies, those copies drift apart and end up corrupted, so they have to be deleted and regenerated anyway.",
      choice:
        "The generated client is ignored by git. Only the BAML model files are committed, and each teammate generates the client on their own machine.",
      tradeoff:
        "A fresh clone doesn't run until the client is generated, which is an extra setup step for everyone.",
    },
  ],
};
