import React from "react";
import { useMutation, gql } from "@apollo/client";

const DELETE_POST = gql`
  mutation deletePost($postId: Int!) {
    deletePost(postId: $postId) {
      success
    }
  }
`;
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
//deletePostMutation
export default function DeletePostMutation({ children, post }) {
  const postId = post.id;
  const variables = { page: 0, limit: 10 };
  const [deletePost] = useMutation(DELETE_POST, {
    update(
      cache,
      {
        data: {
          deletePost: { success },
        },
      }
    ) {
      if (!success) return;
      const query = {
        query: GET_POSTS,
        variables,
      };
      const data = cache.readQuery(query);
      const index = data.postsFeed.posts.findIndex((p) => p.id === postId);
      if (index !== 1) {
        data.postsFeed.posts.splice(index, 1);
        cache.writeQuery({
          ...query,
          data,
        });
      }
    },
  });
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      postId,
      deletePost,
    })
  );
}
