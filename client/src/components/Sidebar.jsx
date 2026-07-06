import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
);

const StudentsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.4" />
    <path d="M4.5 20c0-3.6 3.4-6.2 7.5-6.2s7.5 2.6 7.5 6.2" strokeLinecap="round" />
  </svg>
);

const CoursesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 5.2C4 4.4 4.6 4 5.4 4H11v16H5.4c-.8 0-1.4-.4-1.4-1.2V5.2Z" />
    <path d="M20 5.2c0-.8-.6-1.2-1.4-1.2H13v16h5.6c.8 0 1.4-.4 1.4-1.2V5.2Z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" strokeLinecap="round" />
    <path d="M16 16l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12H9" strokeLinecap="round" />
  </svg>
);

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { to: "/students", label: "Students", icon: StudentsIcon },
  { to: "/courses", label: "Courses", icon: CoursesIcon },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const initials = (user?.name || "A")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">SM</div>
        <div className="sidebar-brand-text">
          <strong>Student Records</strong>
          <span>Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <button type="button" className="sidebar-logout" onClick={logout}>
          <LogoutIcon />
          Log out
        </button>
      </div>
    </aside>
  );
}
