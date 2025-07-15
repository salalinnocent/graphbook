import React, { useState } from "react";
//abstracted from my feed component: Form Submission

//ADDED THIS AFTER THE CONSOLE WAS SAYING CHANGEPOST WAS NOT A FUNCTION SO I MADE IT AS A FUNCTION

export default function PostForm({ addPost, postContent, changePostContent }) {
  const [postAdded, setPostAdded] = useState(false);

  const changeState = (state) => {
    setPostAdded(state);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addPost({ variables: { post: { text: postContent } } });
      console.log("A postfrom request was made", res);
      changePostContent("");
      changeState(true);
    } catch (error) {
      console.log("What is the error", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-md p-6 space-y-4"
      >
        <textarea
          value={postContent}
          onChange={(e) => changePostContent(e.target.value)}
          placeholder="Write your post here amigo !!!"
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        ></textarea>
        <input
          type="submit"
          value="Submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        />
      </form>
    </div>
  );
}
