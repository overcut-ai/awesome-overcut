import buildGraphQLProvider from "ra-data-graphql-amplication";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
// We no longer need to manually inject an Authorization header; rely on cookies.

const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_REACT_APP_SERVER_URL}/graphql`,
  credentials: "include", // send cookies with each request
});


export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  // Always include credentials (cookies) in requests
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});

export default buildGraphQLProvider({
  client: apolloClient,
});
