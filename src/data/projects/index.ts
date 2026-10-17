import type { Project } from "@/types/project";
import { scndcom } from "./scndcom";
import { teleshow } from "./teleshow";
import { workoutTracker } from "./workout-tracker";
import { starchart } from "./starchart";

// Add a project: create src/data/projects/<id>.ts, then list it here.
export const projects: Project[] = [
  starchart,
  teleshow,
  scndcom,
  workoutTracker,
];
