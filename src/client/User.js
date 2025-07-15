import Bar from "./components/bar/index.js";
import CurrentUserQuery from "./components/queries/currentUser.js";
import UserProfile from "./components/user/index.js";

//User.js
export default function User() {
  return (
    <CurrentUserQuery>
      <Bar changeLoginState={changeLoginState} />
      <UserProfile />
      <Chats />
    </CurrentUserQuery>
  );
}
