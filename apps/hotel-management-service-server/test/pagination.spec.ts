import { applyPaginationDefaults, MAX_PAGE_SIZE } from "../src/pagination";

describe("applyPaginationDefaults", () => {
  it("should set take to MAX_PAGE_SIZE and leave skip undefined when not provided", () => {
    const args = {};
    const result = applyPaginationDefaults(args);
    expect(result.take).toBe(MAX_PAGE_SIZE);
    expect(result.skip).toBeUndefined();
  });

  it("should keep take unchanged when within limits", () => {
    const args = { take: 20 };
    const result = applyPaginationDefaults(args);
    expect(result.take).toBe(20);
  });

  it("should cap take at MAX_PAGE_SIZE when it exceeds the limit", () => {
    const args = { take: MAX_PAGE_SIZE + 50 };
    const result = applyPaginationDefaults(args);
    expect(result.take).toBe(MAX_PAGE_SIZE);
  });

  it("should clamp negative skip values to 0", () => {
    const args = { skip: -5 };
    const result = applyPaginationDefaults(args);
    expect(result.skip).toBe(0);
  });
});
