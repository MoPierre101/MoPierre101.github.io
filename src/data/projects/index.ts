import type { Project } from "@/types/project";
import { jobFinder } from "./job-finder";
import { scndcom } from "./scndcom";
import { starchart } from "./starchart";
import { teleshow } from "./teleshow";

// Add a project: create src/data/projects/<id>.ts, then list it here.
export const projects: Project[] = [starchart, teleshow, scndcom, jobFinder];
