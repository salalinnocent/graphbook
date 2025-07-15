import React from "react";
import DropDown from "../helpers/dropdown.js";
import Icon from "../fontawesome.js";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import DeletePostMutation from "../mutations/deletePost.js";
import { Link } from "react-router-dom";

// PostHeader
export default function PostHeader({ post, changeState }) {
  return (
    <div className="flex items-center justify-between mb-4">
      {/* User Info */}
      <Link
        to={`/user${post.user.username}`}
        className="flex items-center gap-3"
      >
        <img
          src={post.user.avatar}
          alt={post.user.username}
          className="w-10 h-10 rounded-full border border-gray-300"
        />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {post.user.username}
          </h2>
        </div>
      </Link>

      {/* Dropdown Menu */}
      <DropDown
        trigger={
          <Icon icon={faAngleDown} className="text-gray-500 cursor-pointer" />
        }
      >
        <button
          onClick={changeState}
          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          Edit
        </button>
        <DeletePostMutation post={post}>
          <DeleteButton />
        </DeletePostMutation>
      </DropDown>
    </div>
  );
}

// Delete Button
function DeleteButton({ deletePost, postId }) {
  return (
    <button
      onClick={() => {
        deletePost({ variables: { postId } });
      }}
      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
    >
      Delete
    </button>
  );
}
