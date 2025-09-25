// Jest mock for @prisma/client used in test environment. It is purposely **very**
// light-weight – we only need to satisfy the TypeScript compiler and provide stubs
// so that service methods can be executed during unit/e2e tests without an actual
// database connection.

export class PrismaClient {
  // Allow any property access (e.g. `this.prisma.customer`) without type errors
  // and return jest mock functions so that calls can be asserted if needed.
  [key: string]: any;

  $connect = jest.fn();
  $disconnect = jest.fn();
  $on = jest.fn();
  $queryRaw = jest.fn();

  constructor() {
    // Return mock delegate objects for common model names that appear in the
    // generated services. Each delegate simply maps every method to a jest.fn().
    const modelNames = [
      "customer",
      "hotel",
      "reservation",
      "room",
    ];

    modelNames.forEach((model) => {
      this[model] = new Proxy(
        {},
        {
          get: () => jest.fn(),
        }
      );
    });
  }
}

// Re-export Prisma namespace objects that may be imported in the codebase. We
// only export what’s required by the compilation process. If additional enums
// or types are needed in the future they can be stubbed here.
export const Prisma = {
  // Common error classes stubbed for filters/interceptors
  PrismaClientKnownRequestError: class MockPrismaClientKnownRequestError extends Error {},
  PrismaClientValidationError: class MockPrismaClientValidationError extends Error {},
};

// The generator usually also exports `Decimal`. Provide a minimal stub to avoid
// runtime failures when casting/formatting numeric fields in tests.
export class Decimal {
  constructor(private readonly value: number | string) {}
  toNumber() {
    return Number(this.value);
  }
}

// Default export needs to mimic the real package structure (ESModule interop)
export default {
  PrismaClient,
  Prisma,
  Decimal,
};
