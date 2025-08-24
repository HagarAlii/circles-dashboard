import Sidebar from "../sideBar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAdmin } from "../../Context/useAdmin"; 

export default function App() {
  const { admin, loading } = useAdmin(); 

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true" || false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");
    return saved === "true" || false;
  });

  // Save darkMode & sidebarOpen to localStorage on change
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col min-h-screen">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} admin={admin} />
        <div className="flex-1 pl-16">
          <Navbar
            toggleDark={() => setDarkMode(!darkMode)}
            darkMode={darkMode}
            admin={admin}
            loading={loading}
          />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
