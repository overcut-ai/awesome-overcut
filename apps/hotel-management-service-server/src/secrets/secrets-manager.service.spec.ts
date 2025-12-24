import { EnumSecretsNameKey } from "./secrets-name-key.enum";
import { SecretsManagerService } from "./secrets-manager.service";

const mockAwsSend = jest.fn();
const mockGcpAccess = jest.fn();

jest.mock("@aws-sdk/client-secrets-manager", () => {
  return {
    SecretsManagerClient: jest.fn().mockImplementation(() => ({
      send: mockAwsSend,
    })),
    GetSecretValueCommand: jest.fn().mockImplementation((input) => input),
  };
});

jest.mock("@google-cloud/secret-manager", () => {
  return {
    SecretManagerServiceClient: jest.fn().mockImplementation(() => ({
      accessSecretVersion: mockGcpAccess,
    })),
  };
});

describe("SecretsManagerService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    delete process.env.SECRETS_MANAGER_PROVIDER;
    delete process.env.SECRETS_MANAGER_SECRET_ID;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("fetches and caches secrets via AWS provider", async () => {
    process.env.SECRETS_MANAGER_PROVIDER = "aws";
    process.env.SECRETS_MANAGER_SECRET_ID = "hotel/creds";
    process.env.AWS_REGION = "us-east-1";

    mockAwsSend.mockResolvedValueOnce({
      SecretString: JSON.stringify({
        [EnumSecretsNameKey.DB_URL]: "postgres://aws/primary",
      }),
    });

    const service = new SecretsManagerService();

    await expect(service.getSecret(EnumSecretsNameKey.DB_URL)).resolves.toBe(
      "postgres://aws/primary"
    );

    await service.getSecret(EnumSecretsNameKey.DB_URL);
    expect(mockAwsSend).toHaveBeenCalledTimes(1);
  });

  it("fetches secrets via GCP provider", async () => {
    process.env.SECRETS_MANAGER_PROVIDER = "gcp";
    process.env.SECRETS_MANAGER_SECRET_ID = "projects/demo/secrets/hotel";
    process.env.GCP_PROJECT_ID = "demo";

    mockGcpAccess.mockResolvedValueOnce([
      {
        payload: {
          data: Buffer.from(
            JSON.stringify({
              [EnumSecretsNameKey.DB_USER]: "gcp-user",
            })
          ),
        },
      },
    ]);

    const service = new SecretsManagerService();

    await expect(service.getSecret(EnumSecretsNameKey.DB_USER)).resolves.toBe(
      "gcp-user"
    );
    expect(mockGcpAccess).toHaveBeenCalledTimes(1);
  });

  it("falls back to env provider when no remote provider is configured", async () => {
    process.env[EnumSecretsNameKey.DB_PASSWORD] = "local-password";

    const service = new SecretsManagerService();
    await expect(service.getSecret(EnumSecretsNameKey.DB_PASSWORD)).resolves.toBe(
      "local-password"
    );

    expect(mockAwsSend).not.toHaveBeenCalled();
    expect(mockGcpAccess).not.toHaveBeenCalled();
  });

  it("updates secrets and populates process.env for the env provider", async () => {
    process.env.SECRETS_MANAGER_PROVIDER = "env";
    const service = new SecretsManagerService();

    await service.updateSecrets({
      [EnumSecretsNameKey.DB_PASSWORD]: "rotated-password",
    });

    expect(process.env[EnumSecretsNameKey.DB_PASSWORD]).toBe("rotated-password");
  });
});
