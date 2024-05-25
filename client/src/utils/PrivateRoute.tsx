import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface PrivateProp {
  children: ReactNode;
}

export default function Home({ children }: PrivateProp) {
  const { isAuth } = useAuth();

  return <>{isAuth ? children : <Navigate to={"/login"} replace />}</>;
}
