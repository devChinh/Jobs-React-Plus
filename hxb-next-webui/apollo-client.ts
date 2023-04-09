import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getCookie } from "cookies-next";

export interface ApolloClientInterface {
  uri: string;
}

const apolloClient = (options: ApolloClientInterface) => {
  const httpLink = createHttpLink({
    uri: options.uri,
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = getCookie("token", {
      path: "/",
    });
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    // uri: process.env.HOST_GRAPHQL || "http://localhost:3001/graphql",
    uri: options.uri,
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export default apolloClient;
