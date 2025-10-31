import { gql } from "@apollo/client/core";
import { AuthProvider } from "react-admin";
// Note: We no longer persist credentials in localStorage.
import { Credentials, LoginMutateResult } from "../types";
import { apolloClient } from "../data-provider/graphqlDataProvider";

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      username
      accessToken
    }
  }
`;

export const jwtAuthProvider: AuthProvider = {
  login: async (credentials: Credentials) => {
    const userData = await apolloClient.mutate<LoginMutateResult>({
      mutation: LOGIN,
      variables: {
        ...credentials,
      },
    });

    if (userData && userData.data?.login.username) {
      // Cookie is automatically set by the server; nothing to persist client-side
      return Promise.resolve();
    }
    return Promise.reject();
  },
  logout: async () => {
    // Invoke backend mutation to clear HttpOnly cookie
    const LOGOUT = gql`
      mutation logout {
        logout
      }
    `;
    try {
      await apolloClient.mutate({ mutation: LOGOUT });
      // Apollo will include cookies automatically (credentials: include)
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
  checkError: ({ status }: any) => {
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    // Query backend `me` (lightweight) to confirm cookie validity
    const ME = gql`
      query me {
        me {
          id
        }
      }
    `;
    try {
      await apolloClient.query({ query: ME, fetchPolicy: "network-only" });
      return Promise.resolve();
    } catch (error) {
      // If request fails due to 401/403 or network error, treat as unauthenticated
      return Promise.reject(error);
    }
  },
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () => {
    // TODO: Optionally fetch current user via a `me` query. For now, return empty.
    return Promise.resolve({ id: undefined, fullName: undefined, avatar: undefined });
  },
};
