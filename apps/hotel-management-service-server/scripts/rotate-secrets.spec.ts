import { EnumSecretsNameKey } from "../src/secrets/secrets-name-key.enum";
import { SecretsManagerService } from "../src/secrets/secrets-manager.service";
import { generateRandomString, rotateSecretsCli } from "./rotate-secrets";

const updateSecretsMock = jest.fn();
var mockRandomBytes: jest.Mock;

jest.mock("../src/secrets/secrets-manager.service", () => ({
  SecretsManagerService: jest.fn().mockImplementation(() => ({
    updateSecrets: updateSecretsMock,
  })),
}));

jest.mock("crypto", () => {
  const actualCrypto = jest.requireActual<typeof import("crypto")>("crypto");
  const randomBytesMock = jest
    .fn((size: number) => actualCrypto.randomBytes(size))
    .mockName("mockRandomBytes");

  mockRandomBytes = randomBytesMock;

  return {
    ...actualCrypto,
    randomBytes: randomBytesMock,
  };
});

describe("rotate-secrets CLI", () => {
  afterEach(() => {
    jest.clearAllMocks();
    const actualCrypto = jest.requireActual<typeof import("crypto")>("crypto");
    mockRandomBytes
      .mockReset()
      .mockImplementation((size: number) => actualCrypto.randomBytes(size));
  });

  it("generates random strings with the requested length", () => {
    const length = 24;
    const result = generateRandomString(length);
    expect(result).toHaveLength(length);
  });

  it("throws when asked to generate a string with non-positive length", () => {
    expect(() => generateRandomString(0)).toThrow("Length must be greater than 0");
  });

  it("produces new credentials and propagates them to the secrets provider", async () => {
    mockRandomBytes
      .mockImplementationOnce(() =>
        Buffer.from("0123456789abcdef0123456789abcdef", "hex")
      )
      .mockImplementationOnce(() =>
        Buffer.from("fedcba9876543210fedcba9876543210", "hex")
      );

    (SecretsManagerService as jest.Mock).mockClear();
    updateSecretsMock.mockResolvedValueOnce(undefined);

    await rotateSecretsCli();

    expect(SecretsManagerService).toHaveBeenCalledTimes(1);
    expect(updateSecretsMock).toHaveBeenCalledTimes(1);

    const updates = updateSecretsMock.mock.calls[0][0];

    expect(updates[EnumSecretsNameKey.DB_PASSWORD]).toHaveLength(32);
    expect(updates[EnumSecretsNameKey.BCRYPT_SALT]).toHaveLength(32);
    expect(updates[EnumSecretsNameKey.DB_PASSWORD]).not.toEqual(
      updates[EnumSecretsNameKey.BCRYPT_SALT]
    );
  });
});
