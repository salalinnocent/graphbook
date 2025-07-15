import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";

const GET_POSTS = gql`
  query postsFeed($page: Int, $limit: Int) {
    postsFeed(page: $page, limit: $limit) {
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

const ADD_POST = gql`
  mutation addPost($post: PostInput!) {
    addPost(post: $post) {
      id
      text
      user {
        avatar
        username
      }
    }
  }
`;

export default function AddPostMutation({ children, currentUser, variables }) {
  const [postContent, setPostContent] = useState("");

  const [addPost] = useMutation(ADD_POST, {
    update(store, { data: { addPost } }) {
      try {
        const queryOptions = { query: GET_POSTS };
        if (variables) queryOptions.variables = variables;

        const data = store.readQuery(queryOptions);
        const posts = data?.postsFeed?.posts || [];

        store.writeQuery({
          ...queryOptions,
          data: {
            postsFeed: {
              ...data.postsFeed,
              posts: [addPost, ...posts],
            },
          },
        });
      } catch (error) {
        console.log("AddPostMutation update error:", error);
      }
    },

    optimisticResponse: {
      __typename: "Mutation",
      addPost: {
        __typename: "Post",
        id: -1,
        text: postContent,
        user: {
          __typename: "User",
          username: currentUser?.username || "Loading...",
          avatar: currentUser?.avatar || "/public/loading.gif",
        },
      },
    },
  });

  const changePostContent = (value) => setPostContent(value);

  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      addPost,
      postContent,
      changePostContent,
    })
  );
}
