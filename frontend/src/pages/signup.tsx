import { useAuthContext } from "../context/AuthContext";
import { ApiError, signUp } from "../fetch/auth";
import { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const nav = useNavigate();
  // todo: use refs instead of state
  // const emailRef = useRef("");
  // const usernameRef = useRef("");
  // const passwordRef = useRef("");
  // const passwordConfirmRef = useRef("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState() as any;

  const { refetchCurrUser } = useAuthContext();

  // todo: use refs instead of state
  const singUpUser = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();

      try {
        await signUp({ email, password, username });
        refetchCurrUser();
        nav("/");
      } catch (err) {
        setError((err as ApiError).message);
      }
    },
    [email, nav, password, refetchCurrUser, username],
  );

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={(e) => singUpUser(e)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* //todo: add refs instead of states as parameters to the function */}
        <button type="submit">Sign Up</button>
      </form>
      {error && <div>{error}</div>}
    </>
  );
};
