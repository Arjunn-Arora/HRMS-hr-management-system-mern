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
        const user = res.data.user;
        const userRole = user.role;
        
        if (allowedRoles.includes(userRole)) {
          // If onboarding is triggered but not completed, restrict access to only edit-profile
          if ((userRole === 'employee' || userRole === 'team_lead') && user.onboardingStatus === 'Onboarding Triggered') {
            if (window.location.pathname !== '/edit-profile') {
              window.location.href = '/edit-profile';
              return;
            }
          }
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
