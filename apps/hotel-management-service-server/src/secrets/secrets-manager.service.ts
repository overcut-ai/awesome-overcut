import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { EnumSecretsNameKey } from "./secrets-name-key.enum";

type SecretsProvider = "aws" | "gcp" | "env";
type SecretsDictionary = Partial<Record<EnumSecretsNameKey, string>>;

export class SecretsManagerService {
  private readonly provider: SecretsProvider;
  private awsClient?: SecretsManagerClient;
  private gcpClient?: SecretManagerServiceClient;
  private cache: SecretsDictionary = {};
  private remoteSnapshot?: Record<string, string>;

  constructor() {
    this.provider = this.resolveProvider();
  }

  async getSecret(key: EnumSecretsNameKey): Promise<string | null> {
    if (this.cache[key]) {
      return this.cache[key] ?? null;
    }

    let value: string | null = null;

    try {
      if (this.provider === "aws") {
        value = await this.getSecretFromAws(key);
      } else if (this.provider === "gcp") {
        value = await this.getSecretFromGcp(key);
      } else {
        value = this.getSecretFromEnv(key);
      }
    } catch (error) {
      console.warn(
        `[SecretsManagerService] Failed to load secret "${key}" via provider "${this.provider}"`,
        error
      );
      value = null;
    }

    if (value) {
      this.cache[key] = value;
    }

    return value;
  }

  async updateSecrets(updates: SecretsDictionary): Promise<void> {
    const normalizedEntries = Object.entries(updates).filter(([, value]) => Boolean(value));

    if (normalizedEntries.length === 0) {
      console.info("[SecretsManagerService] No secret updates provided");
      return;
    }

    const normalized = normalizedEntries.reduce((acc, [key, value]) => {
      acc[key as EnumSecretsNameKey] = value as string;
      return acc;
    }, {} as SecretsDictionary);

    if (this.provider === "aws") {
      await this.applyUpdatesToAws(normalized);
    } else if (this.provider === "gcp") {
      await this.applyUpdatesToGcp(normalized);
    } else {
      this.applyUpdatesToEnv(normalized);
    }

    this.remoteSnapshot = {
      ...(this.remoteSnapshot ?? {}),
      ...(normalized as Record<string, string>),
    };

    this.cache = {
      ...this.cache,
      ...normalized,
    };
  }

  private resolveProvider(): SecretsProvider {
    const provider = process.env.SECRETS_MANAGER_PROVIDER?.toLowerCase();
    if (provider === "aws" || provider === "gcp" || provider === "env") {
      return provider;
    }

    return "env";
  }

  private getSecretFromEnv(key: EnumSecretsNameKey): string | null {
    return process.env[key] ?? null;
  }

  private async getSecretFromAws(key: EnumSecretsNameKey): Promise<string | null> {
    const secrets = await this.loadAwsSecrets();
    return secrets?.[key] ?? null;
  }

  private async getSecretFromGcp(key: EnumSecretsNameKey): Promise<string | null> {
    const secrets = await this.loadGcpSecrets();
    return secrets?.[key] ?? null;
  }

  private async loadAwsSecrets(): Promise<Record<string, string> | null> {
    if (this.remoteSnapshot) {
      return this.remoteSnapshot;
    }

    const secretId =
      process.env.SECRETS_MANAGER_SECRET_ID || process.env.AWS_SECRETS_MANAGER_SECRET_ID;

    if (!secretId) {
      console.warn(
        "[SecretsManagerService] Missing SECRETS_MANAGER_SECRET_ID for AWS provider"
      );
      return null;
    }

    if (!this.awsClient) {
      this.awsClient = new SecretsManagerClient({
        region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
        // TODO: Wire AWS credentials via environment variables, IAM roles, or configuration files.
      });
    }

    const response = await this.awsClient.send(
      new GetSecretValueCommand({
        SecretId: secretId,
      })
    );

    if (!response.SecretString) {
      console.warn(
        `[SecretsManagerService] Secret ${secretId} did not return a SecretString payload`
      );
      return null;
    }

    const parsed = JSON.parse(response.SecretString) as Record<string, string>;
    this.remoteSnapshot = parsed;
    return parsed;
  }

  private applyUpdatesToEnv(updates: SecretsDictionary): void {
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        return;
      }

      process.env[key] = value;
      console.info(`[SecretsManagerService] (env) ${key} -> ${value}`);
    });

    console.info(
      "[SecretsManagerService] TODO: Persist env provider secret updates to a secure vault."
    );
  }

  private async applyUpdatesToAws(updates: SecretsDictionary): Promise<void> {
    console.info(
      "[SecretsManagerService] TODO: Push updates to AWS Secrets Manager in a production-safe way.",
      { keys: Object.keys(updates) }
    );
  }

  private async applyUpdatesToGcp(updates: SecretsDictionary): Promise<void> {
    console.info(
      "[SecretsManagerService] TODO: Push updates to Google Secret Manager in a production-safe way.",
      { keys: Object.keys(updates) }
    );
  }

  private async loadGcpSecrets(): Promise<Record<string, string> | null> {
    if (this.remoteSnapshot) {
      return this.remoteSnapshot;
    }

    const secretName =
      process.env.SECRETS_MANAGER_SECRET_ID || process.env.GCP_SECRETS_MANAGER_SECRET_ID;

    if (!secretName) {
      console.warn(
        "[SecretsManagerService] Missing SECRETS_MANAGER_SECRET_ID for GCP provider"
      );
      return null;
    }

    if (!this.gcpClient) {
      this.gcpClient = new SecretManagerServiceClient({
        projectId: process.env.GCP_PROJECT_ID,
        // TODO: Provide Google Cloud credentials via service account or workload identity.
      });
    }

    const versionPath = secretName.includes("/versions/")
      ? secretName
      : `${secretName}/versions/latest`;

    const [version] = await this.gcpClient.accessSecretVersion({
      name: versionPath,
    });

    const payload = version.payload?.data?.toString();

    if (!payload) {
      console.warn(`[SecretsManagerService] Secret ${versionPath} returned an empty payload`);
      return null;
    }

    const parsed = JSON.parse(payload) as Record<string, string>;
    this.remoteSnapshot = parsed;
    return parsed;
  }
}
