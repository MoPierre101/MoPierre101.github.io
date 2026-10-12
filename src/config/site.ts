// Details about the site's owner that appear on every page.
export const site = {
  name: "Moses Pierre",
  title: "Aspiring Systems Analyst",
  links: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/moses-j-pierre-network",
    },
    { label: "GitHub", url: "https://github.com/MoPierre101" },
    // Put the PDF at public/resume.pdf
    { label: "Resume", url: `${import.meta.env.BASE_URL}resume.pdf` },
  ],
};
