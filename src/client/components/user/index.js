import React from "react";
import PostsFeedQuery from "../queries/postsFeed.js";
import FeedList from "../posts/feedlist.js";
import UserQuery from "../queries/userQuery.js";
import UserProfileHeader from "../user/header.js";

//UserProfile.js
export default function UserProfile({ username }) {
  const queryVariables = { page: 0, limit: 10, username };
  return (
    <div className="user">
      <div className="inner">
        <UserQuery>
          {/*here I need to add the varaibles to username*/}
          <UserProfileHeader username={username} />
        </UserQuery>
      </div>
      <div className="container">
        <PostsFeedQuery variables={queryVariables}>
          <FeedList />
        </PostsFeedQuery>
      </div>
    </div>
  );
}
