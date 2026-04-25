import {
  IssueClassificationResult,
  IssueProcessingInput,
} from "./types";

export function classifyIssue(
  _issue: IssueProcessingInput,
): IssueClassificationResult {
  return {
    kind: "unclassified",
  };
}
