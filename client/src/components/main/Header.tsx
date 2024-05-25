import { useAuth } from "../../context/AuthContext";
import "./Header.css";

interface Type {
  setShowRoom: (boolean: boolean) => void;
}
export default function Header({ setShowRoom }: Type) {
  const { isAuth, logout, user } = useAuth();
  return (
    <header>
      <nav>
        <h1 onClick={() => setShowRoom(false)}>
          <img src="images/smartrent.png" alt="SMART RENT" />
          <span>{user.fullname.toTitleCase()}</span>
        </h1>
        <ul>
          {user.isAdmin ? <li>Payment Logs</li> : null}
          <li>{user.isAdmin ? "Admin" : "Client"}</li>
          {isAuth ? <li onClick={logout}>LOGOUT</li> : <></>}
        </ul>
      </nav>
    </header>
  );
}
