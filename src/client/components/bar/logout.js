import React from "react";
import { useApolloClient } from "@apollo/client";

export default function Logout({ changeLoginState }) {
  const client = useApolloClient();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    changeLoginState(false);
    client.clearStore();
    console.log("You are logged out !!!");
  };

  return (
    <div className="flex justify-end p-4">
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
