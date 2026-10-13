import type { Project } from "@/types/project";

export const jobFinder: Project = {
  id: "job-finder",
  title: "Job Finder",
  date: { start: "October 2026", end: "Present" },
  summary:
    "Finds new junior analyst jobs in the NYC area every morning and adds them to one Notion table.",
  overview: {
    problem:
      "Finding an entry-level systems analyst role in this job market is hard. Big job boards like LinkedIn draw a flood of applicants and don't list everything, because many employers post only on their own career pages. The roles that fit sit with banks, hospitals, universities and city agencies, spread across many hiring systems. Job Finder reads those systems directly each morning, keeps only the junior analyst roles that fit, and adds each new job to one Notion table.",
    users: [
      "A job seeker looking for entry-level systems and application analyst roles",
    ],
    stack: [
      "Python",
      "GitHub Actions",
      "Notion API",
      "Exa",
      "sentence-transformers",
      "pytest",
    ],
    links: [
      {
        label: "GitHub",
        url: "https://github.com/MoPierre101/job-finder",
      },
    ],
  },
  diagrams: [
    {
      title: "The daily run",
      caption:
        "Runs at 8:07 AM New York time on GitHub Actions. A board that fails to load is listed at the end of the run and does not stop the others.",
      mermaid: `flowchart LR
    Fetch[1. Fetch<br/>read open jobs] --> Convert[2. Convert<br/>one common shape]
    Convert --> Filter[3. Filter<br/>four checks]
    Filter --> Skip[4. Skip<br/>already in Notion]
    Skip --> Save[5. Save<br/>new rows as New]
    Save --> Clean[6. Clean up<br/>remove dismissed rows<br/>of gone jobs]
    Clean --> Report[7. Report<br/>print the totals]`,
    },
    {
      title: "The four checks",
      caption:
        "A job must pass every check to be added. The first three are plain rules, and full descriptions are only downloaded for jobs that pass them. The last check compares the description to example jobs.",
      mermaid: `flowchart LR
    Job[Job] --> Location[1. Location<br/>NYC area or US remote]
    Location --> Title[2. Title<br/>analyst title, no senior words]
    Title --> Date[3. Date<br/>posted in the last 90 days]
    Date --> Description[4. Description<br/>close to the example jobs]
    Description --> Add[Add to Notion]`,
    },
    {
      title: "Finding new companies",
      caption:
        "Exa searches find company job boards. Boards that stop producing matching jobs are dropped after 30 days.",
      mermaid: `flowchart LR
    Search[7 Exa searches a day<br/>aimed at analyst roles] --> Found[New company job boards]
    Found --> Check[Check each address names<br/>a known hiring system]
    Check --> Saved[(discovered.yaml)]
    Saved --> Read[Read every saved board<br/>in each daily run]
    Read --> Active{Matching job in<br/>the last 30 days?}
    Active -->|yes| Saved
    Active -->|no| Drop[Drop the company]`,
    },
    {
      title: "What happens to a job in Notion",
      caption:
        "The program only removes rows marked Not Interested or Closed, and only once their job has left the board. Every other row is never changed.",
      mermaid: `flowchart LR
    Add[Program adds a job] --> New[New]
    New -->|chosen by hand| Saved[Saved]
    New -->|chosen by hand| Acted[Applied, Interview<br/>or Rejected]
    New -->|chosen by hand| Dismissed[Not Interested<br/>or Closed]
    Dismissed -->|job leaves the board| Removed[Row removed]`,
    },
  ],
  stories: [
    {
      id: "US-1",
      story:
        "As a job seeker, I want new junior analyst jobs found for me each day, so I don't check every site myself.",
      criteria: [
        "It runs once a day on its own.",
        "It reads employers' hiring systems directly.",
        "Each new job becomes a row in one Notion table with its title, company, location, link, source and date posted.",
        "A new row starts as New, and I change it as I go: Saved, Applied, Interview, Rejected, Not Interested or Closed.",
      ],
    },
    {
      id: "US-2",
      story:
        "As a job seeker, I want only roles that fit me, so I'm not sorting through noise.",
      criteria: [
        "The title is programmer analyst, systems analyst or application analyst.",
        "Senior, lead, manager and similar titles are dropped.",
        "It is in the NYC area, New Jersey, Connecticut or Philadelphia, or it is US remote.",
        "The job posting is no more than 90 days old.",
        "The description reads like the example jobs I want: gathering requirements, writing user stories and supporting testing, at an entry level.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a job seeker, I want to see job postings as soon as possible from the source, so I can apply early.",
      criteria: [
        "It reads each employer's own hiring system, so a posting can show up here before job boards copy it.",
        "Every morning's run adds the postings that appeared since the last run.",
        "Each row shows the date the job was posted and the date it was added, so I can see how fresh it is.",
      ],
    },
    {
      id: "US-4",
      story: "As a job seeker, I want my table to stay clean and trustworthy.",
      criteria: [
        "A job already in the table is never added twice.",
        "A row marked Not Interested or Closed is removed once its job leaves the company's board.",
        "Every other row is never changed.",
      ],
    },
    {
      id: "US-5",
      story:
        "As a job seeker, I want new employers found for me, so I see companies I would never think to check.",
      criteria: [
        "Daily searches find new company job boards.",
        "Found boards are saved and read in every later run.",
        "A company with no matching job for 30 days is dropped.",
      ],
    },
  ],
  decisions: [
    {
      title: "Public endpoints only, with Exa finding the companies",
      context:
        "The biggest job sites hold the most listings, but reading them means scraping pages or pretending to be a browser. Entry-level analyst jobs also sit mostly with enterprise, finance, healthcare, university and government employers, which are hard to list by hand.",
      choice:
        "The program reads only public endpoints and open data: Greenhouse, Lever, Ashby, SmartRecruiters, Workday and NYC Open Data. Scraping LinkedIn or Indeed is out, and so is faking a browser to get past bot blocking. NYC Jobs is built into the code, because Exa can't find city agencies. Every day, 7 Exa searches aimed at analyst roles find new company boards, up to 100 new boards a run. Each board is saved and read in every later run, and dropped after 30 days with no matching job.",
      tradeoff:
        "Some employers can't be reached. iCIMS's terms ban automatic access, and big-tech career sites can't be read this way. Discovery also depends on what Exa can find, and the searches cost about $5.70 a month, which fits inside Exa's monthly free credit.",
    },
    {
      title: "Analyst titles only, with the level read from the description",
      context:
        'The goal is entry-level systems analyst roles, but companies mostly post "Business Systems Analyst" and put the real level (0-2 years) in the description, so a title rarely says "junior".',
      choice:
        'A title must contain programmer analyst, systems analyst, application analyst or applications analyst, and must not contain a senior word such as senior, lead, manager, director, intern or level II, III or IV. Plain "business analyst" is left out because it usually means a business-major role. Location (NYC, New Jersey, Connecticut, Philadelphia or US remote) and posting date (within 90 days) are plain rules too. All of these run first, so full descriptions are only downloaded for jobs that could pass.',
      tradeoff:
        "A role with an unusual title is missed, and the title rule is the narrowest part of the filter.",
    },
    {
      title: "Compare each description to example jobs by meaning",
      context:
        "The level and the real work of a job are in its description. Exact-word matching can't see them, and word lists need constant fixing.",
      choice:
        "Four example job descriptions are written in filters.yaml, covering the work (gather requirements, write user stories, support testing) and the level (entry level, 0-2 years). Text is turned into numbers that capture its meaning, so similar wording gets similar scores. Each posting's description is split into pieces of about 150 words, the closest piece to each example is found, the four scores are averaged, and the job is kept at 0.45 or above. Pay isn't checked, because a role that fits is worth seeing at any pay.",
      tradeoff:
        "The comparison reads wording, so it doesn't read years of experience or pay directly, and it can't always tell an analyst job from a developer job, which is why the title rule stays. The 0.45 cutoff came from one test and may need tuning.",
    },
    {
      title: "A sentence-transformers model, chosen by comparing three",
      context:
        "The model has to tell an analyst posting from a developer or manager one, or the description check can't pick the right jobs.",
      choice:
        "Three models were compared on real postings. spaCy's medium model gave analyst, developer and manager nearly the same numbers, and its large model squeezed every score into 0.91 to 0.98. sentence-transformers (all-MiniLM-L6-v2) reads whole passages in context, spread scores from about 0.1 to 0.7, and ranked an analyst posting above a developer one about 3 times in 4, so it is the one the app uses.",
      tradeoff:
        "It is right about 3 times in 4, not every time, and it reads only about 190 words at a time, so long descriptions are cut into pieces.",
    },
    {
      title: "A status for every job, and safe cleanup",
      context:
        "Running every day means the same jobs show up again and again, and jobs eventually disappear. Every job needs to live in one place to work through.",
      choice:
        "Every job goes in one Notion database with a status: New, Saved, Applied, Interview, Rejected, Not Interested or Closed. Each job gets an ID made of its source and the source's own ID, such as greenhouse:6136160004, and a job already in the table is skipped. Rows marked Not Interested or Closed are removed once their job is gone from the company's board, and rows with any other status are never touched. The row has to stay while the job is still posted, or the job would be added again.",
      tradeoff:
        "Matching is by ID and not by title, so a company that reposts a role under a new ID while the old posting is still under 90 days old shows up as a visible duplicate.",
    },
  ],
};
