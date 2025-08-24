import { useState, useRef, useEffect } from "react";
import { Sun, Moon, ChevronDown, Bell, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({
  toggleDark,
  darkMode,
  admin,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on small screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  // Handle logout with navigation safety
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("adminUser");
      if (location.pathname !== "/") {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show loading placeholder if admin not loaded yet
  if (!admin) {
    return (
      <header
        className="fixed top-0 left-[64px] right-0 z-40 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-lg border border-white/20 shadow-md dark:backdrop-blur-lg"
        style={{
          background: "var(--color-bg-gradient)",
          borderColor: "var(--shadow-glass)",
        }}
      >
        <h1 className="text-xl font-bold text-white">Loading...</h1>
      </header>
    );
  }

  return (
    <header
      className="fixed top-0 left-[64px] right-0 z-40 flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-lg border border-white/20 shadow-md dark:backdrop-blur-lg"
      style={{
        background: "var(--color-bg-gradient)",
        borderColor: "var(--shadow-glass)",
      }}
    >
      {/* Title */}
      <h1
        className="text-xl gravitas sm:text-2xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent text-shadow-soft"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--gradient-from), white, var(--gradient-to))",
        }}
      >
        Admin Dashboard
      </h1>

      {/* Right Actions */}
      <nav className="flex items-center gap-2 sm:gap-3 md:gap-5 flex-shrink-0">
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDark}
          className="p-2 rounded-full bg-[var(--color-input-bg)] shadow-md hover:shadow-inner transition"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-[var(--color-secondary)]" />
          ) : (
            <Moon className="w-5 h-5 text-[var(--color-primary)]" />
          )}
        </button>

        {/* Notification */}
        <button
          type="button"
          className="relative p-2 rounded-full bg-[var(--color-input-bg)] shadow-md hover:shadow-inner transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 ring-1 ring-white dark:ring-gray-900" />
          </span>
        </button>

        {/* User Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            id="user-menu-button"
            aria-haspopup="true"
            aria-expanded={userDropdownOpen}
            aria-controls="user-menu"
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[var(--color-input-bg)] shadow-glass hover:shadow-inner transition duration-200 backdrop-blur-md"
            title="User menu"
          >
            <img
              src={admin.photoURL || "https://i.pravatar.cc/150?u=admin"}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full ring-2 ring-[var(--color-secondary)] object-cover"
            />
            <span className="hidden xs:inline-block sm:block text-[var(--color-primary)] font-semibold text-sm truncate max-w-[6rem] md:max-w-[8rem]">
              {admin.name || "Admin User"}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-[var(--color-primary)] transition-transform duration-300 ${
                userDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {userDropdownOpen && (
            <div
              id="user-menu"
              role="menu"
              aria-labelledby="user-menu-button"
              className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl ring-1 ring-[var(--shadow-main)] z-50 animate-[fade-slide-in-from-top_0.3s_ease-out-forwards] backdrop-blur-md"
              style={{ backgroundColor: "var(--color-bg-main)" }}
            >
              <ul className="py-2 text-sm text-[var(--color-text-primary)]">
                <li>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-[var(--color-input-bg)] hover:shadow-inner transition"
                    onClick={() => alert("Go to Settings")}
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-[var(--color-input-bg)] hover:text-red-500 hover:shadow-inner transition rounded-b-lg"
                    onClick={() => {
                      if (admin) {
                        // If logged in, handle logout
                        handleLogout();
                      } else {
                        // If logged out, redirect to login page
                        navigate("/");
                      }
                    }}
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" /> {admin ? "Logout" : "Login"}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
