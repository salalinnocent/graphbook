import React from "react";

//UserProfileHeader.js
export default function UserProfileHeader({ avatar, username, email }) {
  return (
    <div className="profileHeader">
      /
      <div className="avatar">
        <img src={avatar} />
      </div>
      <div className="information">
        <p>{username}</p>
        <p>{email}</p>
        <p>
          This application can further be extended and more functionalities can
          be added to load more user data to show{" "}
        </p>
      </div>
    </div>
  );
}

