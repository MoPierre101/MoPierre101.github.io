import type { DateRange } from "@/types/project";

// Writes a project's dates as one phrase, for example "June 2026 to August 2026".
export function formatDateRange({ start, end }: DateRange) {
  return start === end ? start : `${start} to ${end}`;
}
