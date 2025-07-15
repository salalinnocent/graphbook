import React from "react";
import "../assets/css/style.css";
import PostsFeedQuery from "./components/queries/postsFeed.js";
import FeedList from "./components/posts/feedlist.js";
import AddPostMutation from "./components/mutations/addPost.js";
import PostForm from "./components/posts/form.js";

//Feed.jsx File
export default function Feed() {
  //setting up the state for postContent: abstracted in AddPostMutation
  //data layer: using apollo client
  //safety check if the posts doesnt exist: abstracted in AddPostMutation
  //mutation: to addPost and also caching to update the ui without making extra network calls: abstracted in AddPostMutation
  //handlePostContentChange: abstracted in AddPostMutation
  //handleSubmit function: abstracted in form.js
  const queryVariable = { page: 0, limit: 10 };
  console.log("REQUEST GOING TOWARDS FEED.JS MAIN FILE WHERE WE ADD AND QUERY FEED POSTS")
  return (
    <div className="container mx-auto my-10">
      <AddPostMutation variables={queryVariable}>
        <PostForm />
      </AddPostMutation>
      {/*Importing our query & feedlist componenet: created a new layer of abstraction */}
      <PostsFeedQuery variables={queryVariable}>
        <FeedList />
      </PostsFeedQuery>
    </div>
  );
}
