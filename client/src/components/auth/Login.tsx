import { useEffect, useState } from "react";
import "./auth.css";
import { useAuth } from "../../context/AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";

interface FormState {
  [key: string]: string;
  uid: string;
  pwd: string;
}

export default function Login() {
  const [uid, setUid] = useState("");
  const [pwd, setPwd] = useState("");
  const [data, setData] = useState<FormState>({ uid: "", pwd: "" });

  const { login, isAuth, checkSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkSession();
  }, []);

  const handleError = (data: FormState) => {
    for (let key in data) {
      if (!data[key]) {
        return `${key} is empty!`;
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = handleError(data);
    if (error) {
      alert(error);
    }
    login({ uid: uid, pwd: pwd });
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [login, isAuth]);

  useEffect(() => {
    setData({ uid: uid, pwd: pwd });
  }, [uid, pwd]);

  return (
    <>
      {isAuth ? (
        <Navigate to={"/"} />
      ) : (
        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Login</h1>
          </div>
          <form className="auth-card-form" onSubmit={handleSubmit}>
            <div className="form-item">
              <input
                type="text"
                placeholder="Username"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </div>
            <div className="form-item">
              <input
                type="password"
                placeholder="Password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
            </div>
            <input type="submit" value="Login" style={{ width: "100%" }} />
          </form>
          <p style={{ fontSize: ".8rem" }}>
            Don't have an account? <Link to={"/signup"}>Sign up</Link>
          </p>
        </div>
      )}
    </>
  );
}
