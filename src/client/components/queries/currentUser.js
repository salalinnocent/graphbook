import React from "react";
import { gql, useQuery } from "@apollo/client";
const GET_CURRENT_USER = gql`
  query currentUser {
    currentUser {
      id
      avatar
      username
    }
  }
`;
//CurrentUserQuery
export default function CurrentUserQuery({ children }) {
  const { loading, error, data } = useQuery(GET_CURRENT_USER);
  const currentUser = data?.currentUser
  if (loading) {
    return <p>Loading...</p>;
  }
  if (typeof children === "function") {
    return children({ loading, error, currentUser });
  }
  //safety check
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      loading,
      currentUser,
      error
    })
  );
}
