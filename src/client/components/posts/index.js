import React, { useState } from "react";
import PostHeader from "./header.js";
import PostContent from "./content.js";
import UpdatePostMutation from "../mutations/updatePost.js";
import PostForm from "./form.js";

export default function Post({ post }) {
  const [editing, setEditing] = useState(false);
  const [postContent, setPostContent] = useState(post.text);

  const toggleEdit = () => setEditing((prev) => !prev);

  return (
    <div
      className={
        "bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-300 " +
        (post.id < 0 ? "opacity-70 animate-pulse" : "")
      }
    >
      <PostHeader post={post} changeState={toggleEdit} />
      {!editing && <PostContent post={post} />}
      {editing && (
        <UpdatePostMutation
          post={post}
          postContent={postContent}
          changePostContent={setPostContent}
        >
          <PostForm changeState={toggleEdit} />
        </UpdatePostMutation>
      )}
    </div>
  );
}
