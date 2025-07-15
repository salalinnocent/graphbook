import React from "react";
import { useMutation, gql } from "@apollo/client";
import Loading from "../loading.js";
import Error from "../error.js";

const SIGNUP = gql`
  mutation signup($email: String!, $username: String!, $password: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
    }
  }
`;

//SignupMutation
export default function SignupMutation({ children, changeLoginState }) {
  const [signup, { loading, error }] = useMutation(SIGNUP, {
    update(store, { data: { signup } }) {
      if (signup.token) {
        localStorage.setItem("jwt", signup.token);
        changeLoginState(true);
      }
    },
  });
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error message={error.message} />;
  }
  return React.Children.map(children, (child) =>
    React.cloneElement(child, {
      signup,
      loading,
      error,
    })
  );
}
