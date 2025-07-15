import React from "react";
import Icon from "../fontawesome.js";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function UserBar({ user }) {
  if (!user) return null;

  return (
    <div className="flex items-center gap-3 p-2 bg-white border rounded-lg shadow-sm hover:border-red-700">
      <Icon icon={faUser} className="text-gray-600 w-3 h-3" />
      {/* <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" /> */}
      <span className="text-gray-800 font-small">{user.username}</span>
    </div>
  );
}
