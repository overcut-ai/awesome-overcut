/**
 * Shared pagination utilities.
 */

export const MAX_PAGE_SIZE = 100;

/**
 * Ensures `take` and `skip` arguments are within sensible defaults.
 *
 * - If `take` is `undefined` or greater than `MAX_PAGE_SIZE`, it will be set to `MAX_PAGE_SIZE`.
 * - If `skip` is provided and is less than `0`, it will be clamped to `0`.
 *
 * The function returns a shallow–copied object preserving all original properties
 * while applying the sanitized `take` and `skip` values. The return type is kept
 * generic so that TypeScript maintains type information from the original args.
 */
export function applyPaginationDefaults<
  T extends {
    take?: number;
    skip?: number;
    [key: string]: unknown;
  }
>(args: T): T {
  const sanitized: T = {
    ...args,
    take:
      args.take === undefined || args.take === null
        ? (MAX_PAGE_SIZE as unknown as T["take"])
        : (Math.min(args.take as number, MAX_PAGE_SIZE) as unknown as T["take"]),
    skip:
      args.skip !== undefined && (args.skip as number) < 0
        ? (0 as unknown as T["skip"])
        : args.skip,
  };

  return sanitized;
}
