import React, { useState, useEffect } from "react";
import "../assets/css/style.css";
import { Helmet } from "react-helmet";
import { useApolloClient } from "@apollo/client";
import Routing from "./router.js";

//App.jsx File
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //handling the state of login by passing state as arg so we can flip
  const changeLoginState = (state) => {
    setIsLoggedIn(state);
  };
  //when the token expires we automatically make the user login again
  const client = useApolloClient();
  useEffect(() => {
    const unsubsribe = client.onResetStore(() => {
      setIsLoggedIn(false);
    });
    return () => unsubsribe();
  }, [client]);

  //hook to check if the token is there
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      console.log("We got the token");
      setIsLoggedIn(true);
    } else {
      console.log("We didnt got the token");
      setIsLoggedIn(false);
    }
  }, []);
  return (
    <div>
      <Helmet>
        <title>GraphBook</title>
        <meta
          name="desciption"
          content="Newsfeed of all of your friends on graphbook"
        ></meta>
      </Helmet>
      <Routing loggedIn={isLoggedIn} changeLoginState={changeLoginState} />
    </div>
    // </div>
  );
}
