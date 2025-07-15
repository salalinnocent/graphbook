import React, { useEffect, useState } from "react";
import Error from "./error.js";
import LoginMutation from "./mutations/login.js";
import RegisterMutation from "./mutations/signup.js";
import Loading from "./loading.js";
import back_image from "../../../src/assets/images/back_image.jpg";
import thestorygraph from "../../../src/assets/images/thestorygraph.svg";
//LoginRegisterForm.js
export default function LoginRegisterForm({ changeLoginState }) {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div
      style={{
        backgroundImage: `url(${back_image})`,
      }}
      className="flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat h-screen w-screen"
    >
      <div className="w-full max-w-md">
        {showLogin ? (
          <div className="pr-16">
            <LoginMutation changeLoginState={changeLoginState}>
              <LoginForm />
            </LoginMutation>
            <p className="text-center mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <button
                onClick={() => setShowLogin(false)}
                className="text-red-600 hover:underline text-xl"
              >
                Sign up
              </button>
            </p>
          </div>
        ) : (
          <div>
            <RegisterMutation changeLoginState={changeLoginState}>
              <RegisterForm />
            </RegisterMutation>
            <p className="text-center mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setShowLogin(true)}
                className="text-red-600 hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
//LoginFrom
function LoginForm({ login, loading }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setFormError("Please enter valid credentials");
      return;
    }
    login({ variables: formData });
  };

  const handleFocus = () => formError && setFormError("");

  if (loading) return <Loading />;

  return (
    <form
      className="bg-white shadow-md rounded-xl p-8 space-y-6"
      onSubmit={handleLogin}
    >
      <div className="flex flex-row items-center justify-center gap-4">
        <h2 className="text-3xl font-secondary font-bold text-center text-red-700">
          GraphbooK
        </h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          onFocus={handleFocus}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          onFocus={handleFocus}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Login
      </button>

      {formError && (
        <div className="text-center text-sm text-red-600">{formError}</div>
      )}
    </form>
  );
}

//RegisterForm: signup
function RegisterForm({ signup, error, loading }) {
  const [inputError, setInputError] = useState("");
  const [input, setInput] = useState({ email: "", username: "", password: "" });

  const handleSignup = (e) => {
    e.preventDefault();
    if (!input.email || !input.username || !input.password) {
      setInputError("Please enter valid entries");
      return;
    }
    signup({ variables: input });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <form
      className="bg-white shadow-md rounded-xl p-8 space-y-6"
      onSubmit={handleSignup}
    >
      <h2 className="text-3xl font-bold text-center text-red-700">Signup</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          value={input.email}
          onChange={(e) => setInput({ ...input, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          value={input.username}
          onChange={(e) => setInput({ ...input, username: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
          value={input.password}
          onChange={(e) => setInput({ ...input, password: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
      >
        Sign Up
      </button>

      {inputError && (
        <div className="text-center text-sm text-red-600">{inputError}</div>
      )}
    </form>
  );
}
