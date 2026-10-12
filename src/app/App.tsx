import { HashRouter, Route, Routes } from "react-router";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { InfoPage } from "@/features/info";
import { NotFoundPage } from "@/features/not-found";
import { ProjectPage } from "@/features/project";
import { WorkPage } from "@/features/work";
import { ScrollToTop } from "./ScrollToTop";

/**
 * The whole app. This is where the features are put together, and the only place that imports them.
 *
 * Flow:
 * 1. The router reads the address (`/#/project/starchart`).
 * 2. The top bar and footer appear on every page. The scroll reset runs on each page change.
 * 3. One page is shown between them, chosen by the address:
 *    - `/` is the info page
 *    - `/work` is the list of projects
 *    - `/project/:id` is a project's case study
 *    - anything else is the not-found page
 */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <TopBar />
      <Routes>
        <Route path="/" element={<InfoPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}
