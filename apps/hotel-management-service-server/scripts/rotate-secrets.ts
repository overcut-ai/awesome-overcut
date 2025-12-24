import { randomBytes } from "crypto";
import { EnumSecretsNameKey } from "../src/secrets/secrets-name-key.enum";
import { SecretsManagerService } from "../src/secrets/secrets-manager.service";

/**
 * TODO: Replace this placeholder rotation script with infrastructure-grade automation.
 */
export function generateRandomString(length: number): string {
  if (length <= 0) {
    throw new Error("Length must be greater than 0");
  }

  return randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
}

async function main(): Promise<void> {
  const secretsManager = new SecretsManagerService();

  const updates = {
    [EnumSecretsNameKey.DB_PASSWORD]: generateRandomString(32),
    [EnumSecretsNameKey.BCRYPT_SALT]: generateRandomString(32),
  };

  console.info("[rotate-secrets] Generated new credential candidates:");
  Object.entries(updates).forEach(([key, value]) => {
    console.info(`  ${key}: ${value}`);
  });

  console.info("[rotate-secrets] Submitting updates to secrets provider...");

  try {
    await secretsManager.updateSecrets(updates);
    console.info(
      "[rotate-secrets] Rotation workflow executed. TODO: Replace with audited rotation pipeline."
    );
  } catch (error) {
    console.error("[rotate-secrets] Failed to update secrets", error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error("[rotate-secrets] Unexpected failure", error);
    process.exit(1);
  });
}
