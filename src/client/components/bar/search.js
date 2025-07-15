import React, { useState } from "react";
import UsersSearchQuery from "../queries/searchQuery.js";
import SearchList from "./searchList.js";

export default function SearchBar() {
  const [text, setText] = useState("");

  const handleChangeText = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <input
        onChange={handleChangeText}
        value={text}
        type="text"
        placeholder="Search for Users"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      <UsersSearchQuery variables={{ text }}>
        <SearchList />
      </UsersSearchQuery>
    </div>
  );
}
