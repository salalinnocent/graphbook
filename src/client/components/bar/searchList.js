import React, { useEffect, useRef, useState } from "react";

export default function SearchList({ users }) {
  const [showList, setShowList] = useState(users.length > 0);
  const listRef = useRef(null);

  const handleClickOutside = (e) => {
    if (listRef.current && !listRef.current.contains(e.target)) {
      setShowList(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      setShowList(true);
      document.addEventListener("click", handleClickOutside);
    } else {
      setShowList(false);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [users]);

  if (!showList) return null;

  return (
    <div
      ref={listRef}
      className="absolute z-10 mt-2 w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden"
    >
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 transition-colors"
        >
          {/* <img
            src={user.avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover"
          /> */}
          <span className="text-gray-800 font-medium">{user.username}</span>
        </div>
      ))}
    </div>
  );
}
