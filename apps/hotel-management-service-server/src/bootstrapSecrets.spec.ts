import { EnumSecretsNameKey } from "./secrets/secrets-name-key.enum";

const mockGetSecret = jest.fn<Promise<string | null>, [EnumSecretsNameKey]>();

jest.mock("./secrets/secrets-manager.service", () => {
  return {
    SecretsManagerService: jest.fn().mockImplementation(() => ({
      getSecret: mockGetSecret,
    })),
  };
});

describe("bootstrapSecrets", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    mockGetSecret.mockReset();
    process.env = { ...originalEnv };
    Object.values(EnumSecretsNameKey).forEach((key) => delete process.env[key]);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fetches required secrets once and hydrates process.env", async () => {
    mockGetSecret.mockImplementation(async (key) => `value-for-${key}`);

    const { bootstrapSecrets } = await import("./bootstrapSecrets");
    await bootstrapSecrets();

    Object.values(EnumSecretsNameKey).forEach((key) => {
      expect(process.env[key]).toBe(`value-for-${key}`);
    });

    expect(mockGetSecret).toHaveBeenCalledTimes(
      Object.values(EnumSecretsNameKey).length
    );

    await bootstrapSecrets();
    expect(mockGetSecret).toHaveBeenCalledTimes(
      Object.values(EnumSecretsNameKey).length
    );
  });

  it("logs warning when a secret cannot be fetched", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    mockGetSecret.mockResolvedValueOnce("value-for-DB_URL");
    mockGetSecret.mockResolvedValueOnce(null);
    mockGetSecret.mockResolvedValue("value-for-default");

    const { bootstrapSecrets } = await import("./bootstrapSecrets");
    await bootstrapSecrets();

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Secret \"DB_USER\" is not defined")
    );

    warnSpy.mockRestore();
  });
});
