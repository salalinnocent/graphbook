import React from "react";
import SearchBar from "../bar/search.js";
import UserBar from "./user.js";
import UserConsumer from "../context/user.js";
import Logout from "./logout.js";

export default function Bar({ changeLoginState, user }) {
  return (
    <div className="w-full bg-white border-b border-red-700 shadow-sm px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Left: Search bar */}
        <div className="flex items-center gap-4">
          <SearchBar />
        </div>

        {/* Right: User and Logout */}
        <div className="flex items-center gap-4">
          <UserConsumer>
            <UserBar user={user} />
          </UserConsumer>
          <Logout changeLoginState={changeLoginState} />
        </div>
      </div>
    </div>
  );
}
