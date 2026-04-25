import {
  IssueDispositionOperations,
  SyntheticIssueDispositionPlan,
  SyntheticNonProductionIssueClassificationResult,
} from "./types";

const SYNTHETIC_ISSUE_LABELS = ["triage/synthetic", "won't-fix"] as const;
const SYNTHETIC_ISSUE_LABEL_TO_REMOVE = "needs-rca" as const;

function formatMatchedPhrases(
  classification: SyntheticNonProductionIssueClassificationResult,
): string {
  return classification.matchedPhrases.map((phrase) => `\`${phrase}\``).join(", ");
}

export function createSyntheticIssueDispositionPlan(
  classification: SyntheticNonProductionIssueClassificationResult,
): SyntheticIssueDispositionPlan {
  return {
    addLabels: ["triage/synthetic", "won't-fix"],
    removeLabels: ["needs-rca"],
    closeIssue: true,
    comment:
      "This issue has been classified as synthetic/non-actionable based on explicit issue-body language indicating it is not a real production defect. " +
      `Matched phrases: ${formatMatchedPhrases(classification)}. ` +
      "The issue will be labeled for synthetic triage, removed from the RCA queue, and no repository defect workflow will continue.",
  };
}

export async function applySyntheticIssueDisposition(
  operations: IssueDispositionOperations,
  classification: SyntheticNonProductionIssueClassificationResult,
): Promise<SyntheticIssueDispositionPlan> {
  const disposition = createSyntheticIssueDispositionPlan(classification);

  await operations.addLabels([...SYNTHETIC_ISSUE_LABELS]);
  await operations.removeLabel(SYNTHETIC_ISSUE_LABEL_TO_REMOVE);
  await operations.addComment(disposition.comment);
  await operations.closeIssue();

  return disposition;
}
