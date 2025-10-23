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

function App() {
  const session = useSelector(sessionSelector);
  const dispatch = useDispatch<AppDispatch>();
  const token = session.token || sessionStorage.getItem("token");
  const externalId = session.externalId || sessionStorage.getItem("externalId");
  const username = session.username || sessionStorage.getItem("username");

  const isLoggedIn = !!(token && externalId && username);

  useEffect(() => {
    if (token && externalId && username) {
      dispatch(setSession({ token, username, externalId }));
    } else {
      dispatch(clearSession());
    }
  }, [dispatch]); // only on first mount

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
      </Routes>
    </div>
  );
}

export default App;
