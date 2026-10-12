import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TestPlan } from "@/types/project";
import { Section } from "./Section";

/**
 * The "Test plan" section of a case study.
 *
 * Flow:
 * 1. Reads the approach text and the test cases, using an empty list when there are no cases.
 * 2. If there is neither, renders nothing.
 * 3. Shows the approach paragraph, then a table with one row per test case.
 * 4. The Result column only appears once at least one case has a result.
 */
export function TestPlanSection({ tests }: { tests?: TestPlan }) {
  // 1. Read the parts.
  const { approach, cases = [] } = tests ?? {};

  // 2. Nothing to show.
  if (!approach && cases.length === 0) return null;

  // 4. Hide the Result column until at least one case has a result.
  const showResult = cases.some((testCase) => testCase.result);

  return (
    <Section id="tests" title="Test plan">
      {/* 3. How the project was tested */}
      {approach && (
        <p className="mb-8 max-w-3xl text-lg leading-relaxed">{approach}</p>
      )}

      {/* 3. The test cases */}
      {cases.length > 0 && (
        <Table>
          {/* Column names */}
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Covers</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Expected</TableHead>
              {showResult && <TableHead>Result</TableHead>}
            </TableRow>
          </TableHeader>

          {/* One row per case. Long text wraps instead of stretching the table. */}
          <TableBody>
            {cases.map((testCase) => (
              <TableRow key={testCase.id}>
                <TableCell className="font-medium">{testCase.id}</TableCell>
                <TableCell>{testCase.covers}</TableCell>
                <TableCell className="whitespace-normal">
                  {testCase.steps}
                </TableCell>
                <TableCell className="whitespace-normal">
                  {testCase.expected}
                </TableCell>
                {showResult && <TableCell>{testCase.result}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Section>
  );
}
