import "./App.css";
import { Home } from "./home/Home";
import Navbar from "./navbar/Navbar";
import { Login } from "./user/Login";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sessionSelector, setSession, clearSession } from "./store/sessionSlice";
import  { AppDispatch } from "./store/store";
import { Signup } from "./user/Signup";
import { useNavigate } from "react-router-dom";
import { Session } from "./model/common";

function App() {
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch<AppDispatch>();
  const token = session.token || sessionStorage.getItem("token");
  const externalId = session.externalId || sessionStorage.getItem("externalId");
  const username = session.username || sessionStorage.getItem("username");
  const id = sessionStorage.getItem("id");
  const navigate = useNavigate();
  const isLoggedIn = !!(token && externalId && username);

  useEffect(() => {
    if (token && username && externalId && id) {
               dispatch(setSession({token: token, username: username, externalId: externalId, id: parseInt(id)} as Session))
      } else {
      dispatch(clearSession());
      navigate("/login")
    }
  }, [dispatch, navigate, token, externalId, username]); 

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route path="/signup" element= {<Signup/>}/>
        <Route
            path="/messages/:type/:id"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
          />
      </Routes>
    </div>
  );
}

export default App;
