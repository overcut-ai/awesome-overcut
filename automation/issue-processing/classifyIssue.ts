import {
  IssueClassificationResult,
  IssueProcessingInput,
  SyntheticIssuePhraseMatch,
} from "./types";

const SYNTHETIC_ISSUE_PHRASES: SyntheticIssuePhraseMatch[] = [
  "synthetic triage test",
  "intentionally fake",
  "not a real production problem",
];

function findSyntheticIssuePhraseMatches(
  issue: IssueProcessingInput,
): SyntheticIssuePhraseMatch[] {
  const searchableContent = `${issue.issueTitle}\n${issue.issueBody}`.toLowerCase();

  return SYNTHETIC_ISSUE_PHRASES.filter((phrase) =>
    searchableContent.includes(phrase),
  );
}

export function classifyIssue(
  issue: IssueProcessingInput,
): IssueClassificationResult {
  const matchedPhrases = findSyntheticIssuePhraseMatches(issue);

  if (matchedPhrases.length > 0) {
    return {
      kind: "synthetic-non-production",
      matchedPhrases,
    };
  }

  return {
    kind: "unclassified",
  };
}
