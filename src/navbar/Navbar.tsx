// src/components/Navbar.tsx
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearSession, sessionSelector } from "../store/sessionSlice";
import type { AppDispatch } from "../store/store";
import "./Navbar.css";

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const session = useSelector(sessionSelector);
  const token = session.token || sessionStorage.getItem("token");
  const externalId = session.externalId || sessionStorage.getItem("externalId");
  const username = session.username || sessionStorage.getItem("username");

  const isLoggedIn = !!(token && externalId && username);

  const handleDisconnect = () => {
    dispatch(clearSession());
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar__title" onClick={() => navigate("/")}>
        <h2>YassChat</h2>
      </div>
      <ul className="navbar__links">
        {isLoggedIn ? (
          <li onClick={handleDisconnect} className="navbar__button logout">
            Déconnexion
          </li>
        ) : (
          <>
            <li onClick={() => navigate("/login")} className="navbar__button">
              Connexion
            </li>
            <li onClick={() => navigate("/signup")} className="navbar__button">
              Inscription
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
