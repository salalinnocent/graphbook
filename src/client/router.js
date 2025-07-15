import React, { useState } from "react";
import Main from "./Main.js";
import LoginRegisterationForm from "../client/components/loginregister.js";
import User from "./User.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

//AppRouter.js
export default function Routing({ loggedIn, changeLoginState }) {
  return (
    <Router>
      <Routes>
        {/*First Route: Secured Route*/}
        <Route
          path="/app"
          element={
            <PrivateRoute loggedIn={loggedIn}>
              <Main changeLoginState={changeLoginState} />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:username"
          element={
            <PrivateRoute loggedIn={loggedIn}>
              <User loggedIn={loggedIn} changeLoginState={changeLoginState} />
            </PrivateRoute>
          }
        />
        {/*Second Route: if not secured route we show login page*/}
        <Route
          path="/"
          element={
            <LoginRoute loggedIn={loggedIn}>
              <LoginRegisterationForm changeLoginState={changeLoginState} />
            </LoginRoute>
          }
        />
        {/*Catch All Fallbacks*/}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

//PrivateRoute: Secured Route
function PrivateRoute({ children, loggedIn }) {
  return loggedIn ? children : <Navigate to="/" />;
}

//LoginRoute: if user logged in we redirect it to the /app path
function LoginRoute({ children, loggedIn }) {
  return !loggedIn ? children : <Navigate to="/app" />;
}
