import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/index.js";
import "../assets/css/style.css"

//binding of the apollo client to react
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
