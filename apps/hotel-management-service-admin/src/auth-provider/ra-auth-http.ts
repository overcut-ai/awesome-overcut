import { gql } from "@apollo/client/core";
import { AuthProvider } from "react-admin";
// Using Basic auth over cookies is deprecated; we keep provider but without localStorage persistence.
import { Credentials, LoginMutateResult } from "../types";
import { apolloClient } from "../data-provider/graphqlDataProvider";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      username
      roles
    }
  }
`;

export const httpAuthProvider: AuthProvider = {
  login: async (credentials: Credentials) => {
    const userData = await apolloClient.mutate<LoginMutateResult>({
      mutation: LOGIN,
      variables: {
        ...credentials,
      },
    });

    if (userData && userData.data?.login.username) {
      // Basic auth header will be carried only within this runtime, not persisted.
      return Promise.resolve();
    }
    return Promise.reject();
  },
  logout: () => Promise.resolve(),
  checkError: ({ status }: any) => {
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => Promise.resolve(),
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () => Promise.resolve({ id: undefined, fullName: undefined, avatar: undefined }),
};

function createBasicAuthorizationHeader(
  username: string,
  password: string
): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}
