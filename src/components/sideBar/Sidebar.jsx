import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard,
  Users,
  Megaphone,
  Menu,
  ChartNoAxesCombined,
  X,
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard />, label: "Dashboard", href: "/dashboard" },
  { icon: <Users />, label: "Users", href: "/users" },
  { icon: <ChartNoAxesCombined />, label: "Analytics", href: "/analytics" },
  { icon: <Megaphone /> , label: "Announcements", href: "/announcements" },
];

export default function Sidebar({ open, setOpen , admin }) {
  return (
    <>
      {/* Toggle button  */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed top-4 z-[100] bg-[var(--color-bg-main)] text-[var(--color-primary)] p-2 rounded-full shadow-md hover:shadow-inner transition 
          ${open ? "left-[200px]" : "left-4"}`}
        style={{ transition: "left 0.3s ease" }}
        aria-label="Toggle Sidebar"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col justify-between bg-[var(--color-bg-main)] text-[var(--color-primary)] shadow-xl
          transition-width duration-300 ease-in-out overflow-hidden
          ${open ? "w-64" : "w-16"}`}
        style={{ transitionProperty: "width" }}
      >
        {/* Top */}
        <div className="p-4">
          {/* Logo */}
          <div
            className={`overflow-hidden transition-opacity duration-300 ease-in-out ${
              open ? "opacity-100 max-h-[100px]" : "opacity-0 max-h-0"
            }`}
            style={{ transitionProperty: "opacity, max-height" }}
          >
            <h1 className="text-xl font-bold text-shadow-soft">Admin Panel</h1>
            <p className="text-xs text-[var(--color-secondary)]">
              Your Control Center
            </p>
          </div>

          {/* Nav */}
          <nav className="mt-10 flex flex-col gap-2">
            {navItems.map(({ icon, label, href }) => (
              <NavLink
                key={label}
                to={href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 pe-8 py-3 rounded-xl transition-colors duration-200 group
                  ${
                    isActive 
                      ? "bg-[var(--color-input-bg)] shadow-inner text-[var(--color-primary)]"
                      : "hover:bg-[var(--color-input-bg)] hover:shadow-inner text-[var(--color-primary)]"
                  }`
                }
              >
                <span
                  className="relative text-[var(--color-primary)] group-hover:text-[var(--color-primary-light)] transition-colors duration-200"
                >
                  {icon}
                </span>
                <span
                  className={`text-sm font-medium text-[var(--color-primary)] transition-opacity duration-200 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom - Admin Info */}
        <div className="p-4 border-t border-[var(--color-secondary)]">
          <div className="flex items-center gap-3 mt-4 group/avatar">

            <div
              className={`transition-opacity duration-300 ease-in-out overflow-hidden ${
                open ? "opacity-100 max-h-16" : "opacity-0 max-h-0"
              }`}
              style={{ transitionProperty: "opacity, max-height" }}
            >
              <p className="text-sm font-semibold">{admin?.name || "Admin User"}</p>
              <p className="text-xs text-[var(--color-secondary)]">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
