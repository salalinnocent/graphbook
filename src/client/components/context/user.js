import React from "react";
import { ApolloConsumer, gql } from "@apollo/client";

const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      avatar
      username
    }
  }
`;
//UserConsumer.js
export default function UserConsumer({ children }) {
  return (
    <ApolloConsumer>
      {(client) => {
        const data = client.readQuery({ query: GET_CURRENT_USER });
        const currentUser = data?.currentUser || null
        // const user = {
        //   username: "Test User",
        //   avatar: "/uploads/avatar1.png",
        // };
        return React.Children.map(children, (child) =>
          React.cloneElement(child, {
            user: currentUser,
          })
        );
      }}
    </ApolloConsumer>
  );
}
