import { createBrowserRouter } from "react-router-dom";
import Analytics from "./Pages/analytics/Analytics";
import Users from "./Pages/users/Users";

import Layout from "./components/layout/Layout";
import AdminAnnouncements from "./Pages/AdminAnnouncements/AdminAnnouncements";


import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute"; 
import LoginTrigger from "./Pages/login/LoginTrigger";
import Dashboard from "./Pages/dashboard/Dashboard";
import NotFound from "./Pages/notfound/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // layout with sidebar + navbar
    children: [
      { index: true, element: <LoginTrigger /> },

      // Protected admin routes:
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "analytics", element: <Analytics /> },
          { path: "users", element: <Users /> },
          { path: "/announcements", element: <AdminAnnouncements /> },
        ],
      },

      // 404
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
