import { EnumSecretsNameKey } from "./secrets/secrets-name-key.enum";
import { SecretsManagerService } from "./secrets/secrets-manager.service";

const secretsManager = new SecretsManagerService();
let bootstrapPromise: Promise<void> | null = null;

export async function bootstrapSecrets(): Promise<void> {
  if (bootstrapPromise) {
    return bootstrapPromise;
  }

  bootstrapPromise = (async () => {
    await Promise.all(
      Object.values(EnumSecretsNameKey).map(async (key) => {
        try {
          const secretValue = await secretsManager.getSecret(key);
          if (secretValue) {
            process.env[key] = secretValue;
          } else {
            console.warn(`[bootstrapSecrets] Secret "${key}" is not defined`);
          }
        } catch (error) {
          console.warn(`[bootstrapSecrets] Failed to fetch secret "${key}"`, error);
        }
      })
    );
  })();

  return bootstrapPromise;
}
