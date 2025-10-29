// src/user/Signup.tsx
import { useEffect, useState } from "react";
import { signupUser } from "./SignupAPI";
import { Session, User } from "../model/common";
import { CustomError } from "../model/CustomError";
import { setSession, clearSession, sessionSelector } from "../store/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

export function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector(sessionSelector);

    const [error, setError] = useState({} as CustomError);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const username = (data.get("username") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const password = (data.get("password") || "").toString();
    const confirm = (data.get("confirm_password") || "").toString();

    if (!username || !email || !password) {
      setError(new CustomError("All fields are required."));
      return;
    }
    if (password !== confirm) {
      setError(new CustomError("Passwords do not match."));
      return;
    }

    signupUser({username: username, email: email, password: password} as User,
        (result: Session) => {
            console.log(result);
            window.Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              console.log("granted")
            }
            });
            dispatch(setSession(result));
            navigate("/home");
            form.reset();
            setError(new CustomError(""));
        }, (signupError: CustomError) => {
            console.log(signupError);
            setError(signupError);
            dispatch(clearSession());
            form.reset()
        }
    )
  };

  useEffect(() => {
    if (session?.token || sessionStorage.getItem("token")) {
      navigate("/home");
    }
  }, [session, navigate]);

  return (
    <div className="signup__container">
      <div className="signup">
        <h1 className="signup__title">Create your account</h1>

        <form onSubmit={handleSubmit} className="signup__form" noValidate>
          <input name="username" placeholder="Username" className="signup__input" required /><br/>
          <input name="email" placeholder="Email" type="email" className="signup__email" required /><br/>
          <input name="password" placeholder="Password" type="password" className="signup__input" required /><br/>
          <input name="confirm_password" placeholder="Confirm password" type="password" className="signup__input" required /><br/>
          <button type="submit" className="signup__submit">Sign up</button>
        </form>

        {error && (
          <div className="error">
            {error.message && <span>{error.message}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
