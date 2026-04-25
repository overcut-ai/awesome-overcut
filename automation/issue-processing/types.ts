export interface IssueProcessingInput {
  issueNumber: number;
  issueTitle: string;
  issueBody: string;
}

export interface IssueClassificationResult {
  kind: "unclassified";
}

export interface ProcessIssueResult {
  issue: IssueProcessingInput;
  classification: IssueClassificationResult;
}
