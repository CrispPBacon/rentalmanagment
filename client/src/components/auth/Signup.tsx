import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validRegex } from "../../utils/Tools";

interface FormState {
  [key: string]: string;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [formData, setFormData] = useState<FormState>({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState({});

  const { signup } = useAuth();

  const handleError = (formData: FormState) => {
    for (let key in formData) {
      if (!formData[key].trim()) {
        return `${key} is empty!`;
      }
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/;

    if (
      !validRegex(formData.firstname, nameRegex) ||
      !validRegex(formData.lastname, nameRegex)
    ) {
      return "Please enter a valid firstname and lastname!";
    }
    if (!validRegex(formData.email, emailRegex)) {
      return "Please enter a valid email!";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Password do not match!";
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const error = handleError(formData);
    if (error) {
      return alert(error);
    }
    signup(formData);
  };

  useEffect(() => {
    const userdata = localStorage.getItem("userdata");
    if (userdata) {
      setUser(JSON.parse(userdata));
    }
  }, []);

  useEffect(() => {
    setFormData({
      firstname: firstname,
      lastname: lastname,
      email: email,
      username: uid,
      password: pwd,
      confirmPassword: confirmPwd,
    });
  }, [firstname, lastname, email, uid, pwd, confirmPwd]);

  return (
    <>
      {/* @ts-ignore */}
      {!user?._id ? (
        <div className="auth-card">
          <h1>Sign up</h1>
          <form className="auth-card-form" onSubmit={handleSignup}>
            <div className="form-item">
              <input
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <div className="form-item">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <div className="form-item">
              <input
                type="text"
                placeholder="Username"
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <div className="form-item">
              <input
                type="password"
                placeholder="Password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <div className="form-item">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                autoSave="off"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            <input type="submit" value="Sign up" />
          </form>
          <p style={{ fontSize: ".8rem" }}>
            Already have an account? <Link to={"/login"}>Sign in</Link>
          </p>
        </div>
      ) : (
        <Navigate to={"/"} replace />
      )}
    </>
  );
}
