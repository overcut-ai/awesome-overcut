import { classifyIssue } from "./classifyIssue";
import {
  applySyntheticIssueDisposition,
  createSyntheticIssueDispositionPlan,
} from "./dispositionSyntheticIssue";
import { processIssue } from "./processIssue";
import {
  IssueDispositionOperations,
  IssueProcessingInput,
  SyntheticNonProductionIssueClassificationResult,
} from "./types";

describe("classifyIssue", () => {
  const baseIssue: IssueProcessingInput = {
    issueNumber: 409,
    issueTitle: "Settings page language changes after toggling dark mode",
    issueBody: "Dark mode should not affect localization.",
  };

  it("classifies issues containing an explicit synthetic phrase in the title", () => {
    const classification = classifyIssue({
      ...baseIssue,
      issueTitle: "[Synthetic Triage Test] Fake bug report",
    });

    expect(classification).toEqual({
      kind: "synthetic-non-production",
      matchedPhrases: ["synthetic triage test"],
    });
  });

  it("classifies issues containing an explicit synthetic phrase in the body regardless of case", () => {
    const classification = classifyIssue({
      ...baseIssue,
      issueBody:
        "This is an INTENTIONALLY FAKE report that is NOT A REAL PRODUCTION PROBLEM.",
    });

    expect(classification).toEqual({
      kind: "synthetic-non-production",
      matchedPhrases: ["intentionally fake", "not a real production problem"],
    });
  });

  it("returns all matched phrases in configured order when multiple phrases are present across title and body", () => {
    const classification = classifyIssue({
      ...baseIssue,
      issueTitle: "Synthetic triage test: dark mode issue",
      issueBody:
        "This issue is intentionally fake and not a real production problem.",
    });

    expect(classification).toEqual({
      kind: "synthetic-non-production",
      matchedPhrases: [
        "synthetic triage test",
        "intentionally fake",
        "not a real production problem",
      ],
    });
  });

  it("does not classify normal issues that do not explicitly self-identify as synthetic", () => {
    const classification = classifyIssue({
      ...baseIssue,
      issueTitle: "Bug: settings language resets to default",
      issueBody:
        "Users report that dark mode toggling resets locale preferences after refresh.",
    });

    expect(classification).toEqual({
      kind: "unclassified",
    });
  });
});

describe("createSyntheticIssueDispositionPlan", () => {
  const classification: SyntheticNonProductionIssueClassificationResult = {
    kind: "synthetic-non-production",
    matchedPhrases: ["synthetic triage test", "intentionally fake"],
  };

  it("returns the expected labels, close flag, and explanatory comment", () => {
    expect(createSyntheticIssueDispositionPlan(classification)).toEqual({
      addLabels: ["triage/synthetic", "won't-fix"],
      removeLabels: ["needs-rca"],
      closeIssue: true,
      comment:
        "This issue has been classified as synthetic/non-actionable based on explicit issue-body language indicating it is not a real production defect. " +
        "Matched phrases: `synthetic triage test`, `intentionally fake`. " +
        "The issue will be labeled for synthetic triage, removed from the RCA queue, and no repository defect workflow will continue.",
    });
  });
});

describe("applySyntheticIssueDisposition", () => {
  const classification: SyntheticNonProductionIssueClassificationResult = {
    kind: "synthetic-non-production",
    matchedPhrases: ["not a real production problem"],
  };

  it("applies disposition operations in the expected order and returns the disposition plan", async () => {
    const callOrder: string[] = [];
    const operations: IssueDispositionOperations = {
      addLabels: jest.fn(async (labels: string[]) => {
        callOrder.push(`addLabels:${labels.join(",")}`);
      }),
      removeLabel: jest.fn(async (label: string) => {
        callOrder.push(`removeLabel:${label}`);
      }),
      addComment: jest.fn(async (comment: string) => {
        callOrder.push(`addComment:${comment}`);
      }),
      closeIssue: jest.fn(async () => {
        callOrder.push("closeIssue");
      }),
    };

    const disposition = await applySyntheticIssueDisposition(
      operations,
      classification,
    );

    expect(disposition).toEqual({
      addLabels: ["triage/synthetic", "won't-fix"],
      removeLabels: ["needs-rca"],
      closeIssue: true,
      comment:
        "This issue has been classified as synthetic/non-actionable based on explicit issue-body language indicating it is not a real production defect. " +
        "Matched phrases: `not a real production problem`. " +
        "The issue will be labeled for synthetic triage, removed from the RCA queue, and no repository defect workflow will continue.",
    });
    expect(callOrder).toEqual([
      "addLabels:triage/synthetic,won't-fix",
      "removeLabel:needs-rca",
      `addComment:${disposition.comment}`,
      "closeIssue",
    ]);
    expect(operations.addLabels).toHaveBeenCalledWith([
      "triage/synthetic",
      "won't-fix",
    ]);
    expect(operations.removeLabel).toHaveBeenCalledWith("needs-rca");
    expect(operations.addComment).toHaveBeenCalledWith(disposition.comment);
    expect(operations.closeIssue).toHaveBeenCalledTimes(1);
  });
});

describe("processIssue", () => {
  const issue: IssueProcessingInput = {
    issueNumber: 409,
    issueTitle: "[Synthetic Triage Test] Bug report",
    issueBody: "This is intentionally fake.",
  };

  it("returns classification and disposition when a synthetic issue is processed with disposition operations", async () => {
    const operations: IssueDispositionOperations = {
      addLabels: jest.fn(),
      removeLabel: jest.fn(),
      addComment: jest.fn(),
      closeIssue: jest.fn(),
    };

    const result = await processIssue(issue, {
      dispositionOperations: operations,
    });

    expect(result.issue).toEqual(issue);
    expect(result.classification).toEqual({
      kind: "synthetic-non-production",
      matchedPhrases: ["synthetic triage test", "intentionally fake"],
    });
    expect(result.disposition).toEqual({
      addLabels: ["triage/synthetic", "won't-fix"],
      removeLabels: ["needs-rca"],
      closeIssue: true,
      comment:
        "This issue has been classified as synthetic/non-actionable based on explicit issue-body language indicating it is not a real production defect. " +
        "Matched phrases: `synthetic triage test`, `intentionally fake`. " +
        "The issue will be labeled for synthetic triage, removed from the RCA queue, and no repository defect workflow will continue.",
    });
  });

  it("returns only classification for a synthetic issue when disposition operations are not provided", async () => {
    const result = await processIssue(issue);

    expect(result).toEqual({
      issue,
      classification: {
        kind: "synthetic-non-production",
        matchedPhrases: ["synthetic triage test", "intentionally fake"],
      },
    });
  });

  it("does not attempt disposition for normal issues", async () => {
    const normalIssue: IssueProcessingInput = {
      issueNumber: 500,
      issueTitle: "Bug: settings page layout breaks on mobile",
      issueBody: "Real customer report with reproducible UI bug.",
    };
    const operations: IssueDispositionOperations = {
      addLabels: jest.fn(),
      removeLabel: jest.fn(),
      addComment: jest.fn(),
      closeIssue: jest.fn(),
    };

    const result = await processIssue(normalIssue, {
      dispositionOperations: operations,
    });

    expect(result).toEqual({
      issue: normalIssue,
      classification: {
        kind: "unclassified",
      },
    });
    expect(operations.addLabels).not.toHaveBeenCalled();
    expect(operations.removeLabel).not.toHaveBeenCalled();
    expect(operations.addComment).not.toHaveBeenCalled();
    expect(operations.closeIssue).not.toHaveBeenCalled();
  });
});
