import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error/index.js";
//authenticated the client on the server with every HTTP request we add the token
const AuthLink = new ApolloLink((operation, next) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    }));
  }
  return next(operation);
});

//client side request
//its a function that we call on every request so we attched the AuthLink to cross check the token in every request
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (extensions.code === "UNAUTHENTICATED") {
            localStorage.removeItem("jwt");
            client.resetStore();
          }
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    //attached here
    AuthLink,
    new HttpLink({
      uri: "http://localhost:8000/graphql",
    }),
  ]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
//added this because the apollo dev tools was throwing error: client not found
if (typeof window !== "undefined") {
  window.__APOLLO_CLIENT__ = client;
  window.__APOLLO_DEVTOOLS_GLOBAL_HOOK__?.inject?.({
    ApolloClient: client.constructor,
    client,
  });
}
export default client;
