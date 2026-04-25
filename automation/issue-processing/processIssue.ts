import { classifyIssue } from "./classifyIssue";
import { applySyntheticIssueDisposition } from "./dispositionSyntheticIssue";
import { IssueProcessingInput, ProcessIssueOptions, ProcessIssueResult } from "./types";

export async function processIssue(
  issue: IssueProcessingInput,
  options: ProcessIssueOptions = {},
): Promise<ProcessIssueResult> {
  const classification = classifyIssue(issue);

  if (
    classification.kind === "synthetic-non-production" &&
    options.dispositionOperations
  ) {
    const disposition = await applySyntheticIssueDisposition(
      options.dispositionOperations,
      classification,
    );

    return {
      issue,
      classification,
      disposition,
    };
  }

  return {
    issue,
    classification,
  };
}
