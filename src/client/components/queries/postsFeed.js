import React from "react";
import { useQuery, gql } from "@apollo/client";
import Loading from "../loading.js";
import Error from "../error.js";

const GET_POSTS = gql`
  query postsFeed($page: Int!, $limit: Int!, $username: String) {
    postsFeed(page: $page, limit: $limit, username: $username) {
      posts {
        id
        text
        user {
          avatar
          username
        }
      }
    }
  }
`;
//abstracted the query from my Feed.js file
export default function PostsFeedQuery({ variables, children }) {
  const { page = 0, limit = 10, username } = variables;
  // console.log("PostFeedQuery is loging");
  const queryVariables = { page, limit };
  if (typeof username !== "undefined") {
    queryVariables.username = username;
  }
  const { loading, data, error, fetchMore } = useQuery(GET_POSTS, {
    variables: queryVariables,
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  const posts = data?.postsFeed?.posts || [];
  // console.log("Are these the posts: PostsFeedQuery: ", posts);
  return React.Children.map(children, (child) =>
    React.cloneElement(child, { posts, fetchMore })
  );
}
