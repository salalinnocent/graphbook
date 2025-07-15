import React from "react";
import "../assets/css/style.css";
import Feed from "./Feed.js";
import Chats from "./Chats.js";
import Bar from "../client/components/bar/index.js"
import CurrentUserQuery from "./components/queries/currentUser.js";

//Main.js
export default function Main({ changeLoginState }) {
  return (
    <CurrentUserQuery>
      <>
        <Bar changeLoginState={changeLoginState} />
        <Feed />
        <Chats />
      </>
    </CurrentUserQuery>
  );
}
