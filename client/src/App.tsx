import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./components/Main";
import "./styles/style.css";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Main />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
