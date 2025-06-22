import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("/auth/me");
        const userRole = res.data.user.role;
        if (allowedRoles.includes(userRole)) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [allowedRoles]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return authorized ? children : <Navigate to="/" />;
};

export default PrivateRoute;
