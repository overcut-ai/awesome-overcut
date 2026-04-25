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

export interface IssueDispositionOperations {
  addLabels(labels: string[]): void | Promise<void>;
  removeLabel(label: string): void | Promise<void>;
  addComment(comment: string): void | Promise<void>;
  closeIssue(): void | Promise<void>;
}

export interface SyntheticIssueDispositionPlan {
  addLabels: ["triage/synthetic", "won't-fix"];
  removeLabels: ["needs-rca"];
  closeIssue: true;
  comment: string;
}

export interface ProcessIssueOptions {
  dispositionOperations?: IssueDispositionOperations;
}

export interface ProcessIssueResult {
  issue: IssueProcessingInput;
  classification: IssueClassificationResult;
  disposition?: SyntheticIssueDispositionPlan;
}
