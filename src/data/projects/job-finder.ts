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
    stack: ["Python", "GitHub Actions", "Notion API", "Exa", "pytest"],
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
    Convert --> Filter[3. Filter<br/>six keyword rules]
    Filter --> Skip[4. Skip<br/>already in Notion]
    Skip --> Save[5. Save<br/>new rows as New]
    Save --> Clean[6. Clean up<br/>close gone jobs]
    Clean --> Report[7. Report<br/>print the totals]`,
    },
    {
      title: "The six filter rules",
      caption:
        "A job must pass every rule to be added. Failing any one drops the job, and the run records which rule dropped it.",
      mermaid: `flowchart LR
    Job[Job] --> Location[1. Location<br/>NYC area or US remote]
    Location --> Title[2. Title<br/>analyst, says junior]
    Title --> Exclude[3. Title has no<br/>senior or lead words]
    Exclude --> Experience[4. Experience<br/>at most 1 year]
    Experience --> Age[5. Job posted in the last 90 days]
    Age --> Pay[6. Pay<br/>top at most 150k]
    Pay --> Add[Add to Notion]`,
    },
    {
      title: "Finding new companies",
      caption:
        "Exa searches find job boards the hand-written list doesn't have. Boards that stop producing matching jobs are dropped after 30 days.",
      mermaid: `flowchart LR
    Search[11 Exa searches a day<br/>aimed at junior analyst jobs] --> Found[New company job boards]
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
        "The program only moves rows that are still New or Saved, or that are marked Not Interested. Rows marked Applied, Interview or Rejected are never changed.",
      mermaid: `flowchart LR
    Add[Program adds a job] --> New[New]
    New -->|chosen by hand| Saved[Saved]
    New -->|chosen by hand| Acted[Applied, Interview<br/>or Rejected]
    New -->|chosen by hand| NotInterested[Not Interested]
    New -->|job leaves the board| Closed[Closed]
    Saved -->|job leaves the board| Closed
    NotInterested -->|job leaves the board| Trash[Moved to the Notion trash]`,
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
        "A new row starts as New, and I change it as I go: Saved, Applied, Interview, Rejected or Not Interested.",
      ],
    },
    {
      id: "US-2",
      story:
        "As a job seeker, I want only roles that fit me, so I'm not sorting through noise.",
      criteria: [
        "The title is programmer analyst, systems analyst or application analyst.",
        "The posting says it is junior and asks for at most 1 year of experience.",
        "The job posting is no more than 90 days old.",
        "The top of the pay range is $150,000 or less, unless the title says junior or entry level.",
        "It is in the NYC area, New York State, New Jersey, Connecticut or Philadelphia, or it is US remote.",
        "Senior, lead, manager and similar titles are dropped.",
      ],
    },
    {
      id: "US-3",
      story:
        "As a job seeker, I want to see why a job was dropped, so I can fix the rules.",
      criteria: [
        "A practice run writes nothing to Notion.",
        "A practice run can print every dropped job and the rule that dropped it.",
        "All the rules live in one editable file.",
      ],
    },
    {
      id: "US-4",
      story: "As a job seeker, I want my table to stay clean and trustworthy.",
      criteria: [
        "A job already in the table is never added twice.",
        "A New or Saved row becomes Closed when its job leaves the company's board.",
        "A row I have acted on is never changed.",
        "A board that failed to load never has its rows touched.",
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
      title: "Public endpoints and open data only",
      context:
        "The biggest job sites hold the most listings, but reading them means scraping pages or pretending to be a browser.",
      choice:
        "The program reads only public endpoints and open data: Greenhouse, Lever, Ashby, SmartRecruiters, Recruitee, Workday and NYC Open Data. Scraping LinkedIn or Indeed is out, and so is faking a browser to get past bot blocking.",
      tradeoff:
        "Some employers can't be reached. iCIMS's terms ban automatic access, and big-tech career sites can't be read this way.",
    },
    {
      title: "Analyst roles only, and the job must say it is junior",
      context:
        "The goal is entry-level systems analyst roles, so the program should keep only titles that fit.",
      choice:
        'Four title phrases only: programmer analyst, systems analyst (which covers business systems analyst), application analyst and applications analyst. Plain "business analyst" is left out because it usually means a business-major role. Every job must also say it is junior, either in the title (new grad, entry level, associate, junior, I) or, with a shorter list of phrases, in the posting.',
      tradeoff:
        'A role with an unusual title is missed. The word "associate" counts as junior, but at some banks it means mid-level, so some of those results will not fit.',
    },
    {
      title:
        "Plain keyword rules, with experience counted by the minimum and pay by the top",
      context:
        'Whether a job fits comes down to clear criteria: the title, the level, the years of experience, how old the posting is, the pay and the place. Postings give ranges such as "1-3 years" or "$90k-$140k", and a rule needs one number.',
      choice:
        'Six keyword rules in one editable file, with no AI in the daily run. Matching ignores case, matches whole words only, and treats spaces and hyphens as interchangeable. Experience counts by the low end of a range, with a cap of 1 year: "0-2", "1-2" and "1+" pass, and "2-5" and "3 years" are dropped. Pay counts by the top of the range, which must be $150,000 or less, and the check is skipped for titles that say new grad, junior or entry level. A job with no pay or experience information is kept. A practice run can print every dropped job and the rule that dropped it.',
      tradeoff:
        'Rules only see words. Postings say things like "associate\'s degree" or "mentor junior engineers", so the check for junior wording in the full posting uses a shorter list of phrases than the title check. Jobs that don\'t list pay or experience in a way the rules can read get through.',
    },
    {
      title: "Find companies with Exa instead of a hand-written list",
      context:
        "Entry-level analyst jobs sit mostly with enterprise, finance, healthcare, university and government employers, which are hard to list by hand.",
      choice:
        "The only hand-written entry is NYC Jobs, because Exa can't find city agencies. Every day, 11 Exa searches aimed at junior analyst jobs find new company boards, up to 100 new boards a run. Each board is saved and read in every later run, and dropped after 30 days with no matching job.",
      tradeoff:
        "Discovery depends on what Exa can find, and there is no Philadelphia-specific search yet. The searches cost about $0.30 a day, which fits inside Exa's monthly free credit.",
    },
    {
      title: "A status for every job, and safe cleanup",
      context:
        "Running every day means the same jobs show up again and again, and jobs eventually disappear. Every job needs to live in one place to work through.",
      choice:
        "Every job goes in one Notion database with a status: New, Saved, Applied, Interview, Rejected, Not Interested or Closed. Each job gets an ID made of its source and the source's own ID, such as greenhouse:6136160004, and a job already in the table is skipped. When a job leaves the company's board, New and Saved rows become Closed and Not Interested rows go to the Notion trash. Rows that have been acted on are never touched, and neither are the rows of a company whose board failed to load or came back empty.",
      tradeoff:
        "Matching is by ID and not by title, so a company that reposts a role under a new ID while the old posting is still under 90 days old shows up as a visible duplicate.",
    },
  ],
};
