import { classifyIssue } from "./classifyIssue";
import { IssueProcessingInput, ProcessIssueResult } from "./types";

export function processIssue(issue: IssueProcessingInput): ProcessIssueResult {
  const classification = classifyIssue(issue);

  return {
    issue,
    classification,
  };
}
