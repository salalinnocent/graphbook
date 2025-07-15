import { gql, useQuery } from "@apollo/client";
import React from "react";
import Loading from "../loading.js";
import Error from "../error.js";

const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      id
      avatar
      username
      email
    }
  }
`;
export default function UserQuery({ children, variables }) {
  const { loading, data, error } = useQuery(GET_USER, {
    variables: { username: variables.username },
  });
  const user = data?.user || null;
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      user,
      loading,
      error,
    })
  );
}
