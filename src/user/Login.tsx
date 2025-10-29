import {useEffect, useState} from "react";
import {loginUser} from "./loginApi";
import {Session} from "../model/common";
import {CustomError} from "../model/CustomError";
import { setSession,clearSession,sessionSelector} from "../store/sessionSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { Home } from "../home/Home";
import "./Login.css";

export function Login() {
    const navigate = useNavigate()
    const [error, setError] = useState({} as CustomError);
    //const [session, setSession] = useState({} as Session);
    const dispatch = useDispatch<AppDispatch>();
    const session = useSelector(sessionSelector);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser({user_id: -1, username:  data.get('login') as string, password: data.get('password') as string},
            (result: Session) => {
                window.Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log("granted")
                    }
                });
                console.log(result);
                dispatch(setSession(result));
                //setSession(result);
                navigate("/home")
                
                form.reset();
                setError(new CustomError(""));
            }, (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                //setSession({} as Session);
                dispatch(clearSession());
                navigate("/login")
            });
    };

    useEffect(()=>{
        let token = sessionStorage.getItem("token");
        let externalId = sessionStorage.getItem("externalId");
        let username = sessionStorage.getItem("username");
        let id = sessionStorage.getItem("id");
        if (token && username && externalId && id) {
            dispatch(setSession({token: token, username: username, externalId: externalId, id: parseInt(id)} as Session))
            navigate("/home")
        }
        else {
            navigate("/login")
        }     
    },[dispatch])

    return(
    <div className="login__container">
        <div className="login">
            <h1 className="login__title">Log In</h1>
            <form onSubmit={handleSubmit} className="login__form">
                <input name="login" placeholder="login" className="login__input"/><br/>
                <input name="password" placeholder="password" type="password" className="login__input"/><br/>
                <button type="submit" className="login__submit">connexion</button>
            </form>
            <div className="error">
            { session.token &&
                            <span>{session.username} : {session.token}</span>
                        }
                        { error.message &&
                            <span>{error.message}</span>
                        }
            </div>
                
        </div>
    </div>
    );
}