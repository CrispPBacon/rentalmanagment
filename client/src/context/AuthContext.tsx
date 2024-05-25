import { createContext, ReactNode, useContext, useState } from "react";
import { send_data } from "../utils/posts";
import { Navigate } from "react-router-dom";

interface Type {
  user: { _id: string; fullname: string; isAdmin: boolean };
  isAuth: boolean;
  signup: (data: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => void;
  login: (data: { uid: string; pwd: string }) => void;
  checkSession: () => void;
  logout: () => void;
}

const AuthContextType: Type = {
  user: { _id: "", fullname: "", isAdmin: false },
  signup: () => {},
  isAuth: false,
  login: () => {},
  checkSession: () => {},
  logout: () => {},
};

const AuthContext = createContext<Type>(AuthContextType);

interface Props {
  children: ReactNode;
}

interface UserState {
  _id: string;
  fullname: string;
  isAdmin: boolean;
}
function AuthProvider({ children }: Props) {
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState<UserState>({
    _id: "",
    fullname: "",
    isAdmin: false,
  });

  async function signup(data: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) {
    const res = await send_data("/api/auth", { signup: data });

    if (res?.error) {
      return alert(res.error);
    }
    return alert(res.success);
  }

  async function login(data: { uid: string; pwd: string }) {
    const res = await send_data("/api/auth", { login: data });
    if (res?.error) {
      return alert(res.error);
    }
    if (res?._id) {
      // console.log(res);
      if (!localStorage.getItem("userdata")) {
        localStorage.setItem("userdata", JSON.stringify(res));
        // @ts-ignore
        setUser(JSON.parse(localStorage.getItem("userdata")));
      }
      return setAuth(true);
    }
  }

  async function checkSession() {
    const storedData = localStorage.getItem("userdata");
    if (storedData && JSON.parse(storedData)) {
      const userdata = JSON.parse(storedData);
      const res = await send_data("/api/auth", {
        checkLogin: { _id: userdata._id },
      });
      if (res?._id) {
        // console.log(res);
        setUser(res);
        return setAuth(true);
      }
    }
  }
  function logout() {
    localStorage.clear();
    <Navigate to={"/login"} />;
    return setAuth(false);
  }

  const AuthValue = {
    user,
    isAuth,
    signup,
    login,
    checkSession,
    logout,
  };
  return (
    <AuthContext.Provider value={AuthValue}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
