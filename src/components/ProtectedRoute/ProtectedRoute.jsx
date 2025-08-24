import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "../../Context/useAdmin";

function ProtectedRoute() {
  const { admin, loading } = useAdmin();
  const location = useLocation();

  // While loading, don't navigate or render anything yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // If no admin and not on homepage, redirect to "/"
  if (!admin && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  // If admin and currently on homepage "/", redirect to dashboard
  if (admin && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
