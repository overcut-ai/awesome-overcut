export interface IssueProcessingInput {
  issueNumber: number;
  issueTitle: string;
  issueBody: string;
}

export type SyntheticIssuePhraseMatch =
  | "synthetic triage test"
  | "intentionally fake"
  | "not a real production problem";

export interface SyntheticNonProductionIssueClassificationResult {
  kind: "synthetic-non-production";
  matchedPhrases: SyntheticIssuePhraseMatch[];
}

export interface UnclassifiedIssueClassificationResult {
  kind: "unclassified";
}

export type IssueClassificationResult =
  | SyntheticNonProductionIssueClassificationResult
  | UnclassifiedIssueClassificationResult;

export interface ProcessIssueResult {
  issue: IssueProcessingInput;
  classification: IssueClassificationResult;
}
