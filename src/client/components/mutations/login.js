import { gql, useMutation } from "@apollo/client";
import React from "react";
import Error from "../error.js";
import Loading from "../loading.js";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
//LoginMutation
export default function LoginMutation({ children, changeLoginState }) {
  const [login, { loading, error }] = useMutation(LOGIN, {
    update(store, { data: { login } }) {
      if (login.token) {
        localStorage.setItem("jwt", login.token);
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
      login,
      loading,
      error,
    })
  );
}
