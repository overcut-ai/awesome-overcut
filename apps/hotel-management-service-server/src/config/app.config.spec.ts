import { appConfigValidationSchema } from "./app.config";

describe("appConfigValidationSchema", () => {
  const validEnv = {
    BCRYPT_SALT: "$2b$12$ABCDEFGHIJKLMNOPQRSTUV",
    DB_URL: "postgres://user:pass@localhost:5432/hotel",
    DB_USER: "postgres",
    DB_PASSWORD: "super-secure-password",
    DB_NAME: "hotel",
    DB_PORT: "5432",
    PORT: "3000",
    COMPOSE_PROJECT_NAME: "hotel-management",
  } as const;

  it("accepts a complete and valid environment", () => {
    const { error, value } = appConfigValidationSchema.validate(validEnv, {
      abortEarly: false,
    });

    expect(error).toBeUndefined();
    expect(value).toMatchObject({
      ...validEnv,
      DB_PORT: Number(validEnv.DB_PORT),
      PORT: Number(validEnv.PORT),
    });
  });

  it("rejects missing or malformed variables", () => {
    const { error } = appConfigValidationSchema.validate(
      {
        ...validEnv,
        DB_URL: "not-a-uri",
        DB_PASSWORD: undefined,
      },
      { abortEarly: false }
    );

    expect(error).toBeDefined();
    expect(error?.details.map((detail) => detail.message)).toEqual(
      expect.arrayContaining([
        expect.stringContaining("DB_URL"),
        expect.stringContaining("DB_PASSWORD"),
      ])
    );
  });
});
