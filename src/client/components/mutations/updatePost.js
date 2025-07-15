import { useMutation, gql } from "@apollo/client";
import React from "react";
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
const UPDATE_POST = gql`
  mutation updatePost($post: PostInput, $postId: Int!) {
    updatePost(post: $post, postId: $postId) {
      id
      text
    }
  }
`;

export default function UpdatePostMutation({
  children,
  post,
  postContent,
  changePostContent,
}) {
  //extracted postId from the post prop
  const postId = post.id;
  //defined query variable to fetch the first 10 posts
  const variables = { page: 0, limit: 10 };
  //useMutation hook gives us function to call the mutation
  const [updatePost] = useMutation(UPDATE_POST, {
    //update function manually updates the apollo cache
    update(cache, { data: { updatePost } }) {
      //set up a query object with GET_POSTS and same variable
      const query = {
        query: GET_POSTS,
        variables,
      };
      //read the current data for that query
      const data = cache.readQuery(query);
      //replace the updatedPost in the cache
      const updatedPosts = data.postsFeed.posts.map((p) =>
        p.id === postId ? { ...p, text: updatePost.text } : p
      );
      //write the modified post back into the cache
      cache.writeQuery({
        ...query,
        data: {
          ...data,
          postsFeed: {
            ...data.postsFeed,
            posts: updatedPosts,
          },
        },
      });
    },
    optimisticResponse: {
      _typename: "mutation",
      updatePost: {
        _typename: "Post",
        text: postContent,
      },
    },
  });
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      postId,
      updatePost,
      postContent,
      changePostContent,
    })
  );
}
