import React from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "../loading.js";
import Error from "../error.js";

const GET_USERS = gql`
  query usersSearch($page: Int, $limit: Int, $text: String!) {
    usersSearch(page: $page, limit: $limit, text: $text) {
      users {
        id
        avatar
        username
      }
    }
  }
`;
//UsersSearchQuery
export default function UsersSearchQuery({ children, variables = {} }) {
  //using nullish coalescing operator
  const queryVariables = {
    page: variables.page ?? 0,
    limit: variables.limit ?? 5,
    text: variables.text ?? "",
  };
  //if the text is short then 3 we dont query
  const skip = queryVariables.text.length < 3;
  //executing the GET_USERS query using useQuery hook of apollo
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_USERS, {
    variables: queryVariables,
    skip,
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  if (!data) {
    return null;
  }
  //extracting the data from the usersSearch object which has a nested users array
  /* usersSearch: {
    users: [] 
    } */
  const { usersSearch } = data;
  const { users } = usersSearch;
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      fetchMore,
      refetch,
      users,
      variables: queryVariables,
    })
  );
}
