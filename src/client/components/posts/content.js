import React from "react";
export default function PostContent({ post }) {
  return (
    <div className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap break-words">
      <p>{post.text}</p>
    </div>
  );
}
