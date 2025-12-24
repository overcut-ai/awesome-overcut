import "reflect-metadata";

import { MODULE_METADATA } from "@nestjs/common/constants";
import { ConfigService } from "@nestjs/config";
import { ApolloDriverConfig } from "@nestjs/apollo";

import { AppModule } from "../app.module";

type GraphQlOptionsFactory = (configService: ConfigService) => ApolloDriverConfig;

const getGraphQlOptionsFactory = (): GraphQlOptionsFactory => {
  const imports =
    (Reflect.getMetadata(MODULE_METADATA.IMPORTS, AppModule) as Array<unknown>) ?? [];

  const graphQlDynamicModule = imports.find(
    (entry: any) => entry?.module?.name === "GraphQLModule"
  ) as { providers?: Array<{ provide: unknown; useFactory?: unknown }> } | undefined;

  if (!graphQlDynamicModule) {
    throw new Error("GraphQLModule was not found in AppModule imports");
  }

  const optionsProvider = graphQlDynamicModule.providers?.find(
    (provider: any) => provider.provide === "GqlModuleOptions"
  );

  if (!optionsProvider?.useFactory) {
    throw new Error("GraphQL module options factory could not be located");
  }

  return optionsProvider.useFactory as GraphQlOptionsFactory;
};

const graphQlOptionsFactory = getGraphQlOptionsFactory();

const resolveGraphQlOptions = async (
  envOverrides: Partial<Record<string, string | undefined>>
): Promise<ApolloDriverConfig> => {
  const configServiceMock = {
    get: (key: string) => envOverrides[key],
  } as Pick<ConfigService, "get"> as ConfigService;

  return graphQlOptionsFactory(configServiceMock);
};

describe("AppModule GraphQL configuration guards", () => {
  it("disables playground and introspection whenever NODE_ENV is production", async () => {
    const options = await resolveGraphQlOptions({
      NODE_ENV: "production",
      GRAPHQL_PLAYGROUND: "true",
      GRAPHQL_INTROSPECTION: "true",
    });

    expect(options.playground).toBe(false);
    expect(options.introspection).toBe(false);
  });

  it("honors non-production env flags with proper boolean parsing", async () => {
    const options = await resolveGraphQlOptions({
      NODE_ENV: "development",
      GRAPHQL_PLAYGROUND: "TRUE",
      GRAPHQL_INTROSPECTION: "false",
    });

    expect(options.playground).toBe(true);
    expect(options.introspection).toBe(true);
  });

  it("allows introspection when explicitly requested even if playground is disabled", async () => {
    const options = await resolveGraphQlOptions({
      NODE_ENV: "staging",
      GRAPHQL_PLAYGROUND: "FALSE",
      GRAPHQL_INTROSPECTION: "TRUE",
    });

    expect(options.playground).toBe(false);
    expect(options.introspection).toBe(true);
  });

  it("falls back to false when env variables are missing", async () => {
    const options = await resolveGraphQlOptions({ NODE_ENV: "test" });

    expect(options.playground).toBe(false);
    expect(options.introspection).toBe(false);
  });

  it("treats any non-'true' string as false", async () => {
    const options = await resolveGraphQlOptions({
      NODE_ENV: "local",
      GRAPHQL_PLAYGROUND: "yes",
      GRAPHQL_INTROSPECTION: "TrUe",
    });

    expect(options.playground).toBe(false);
    expect(options.introspection).toBe(true);
  });
});
