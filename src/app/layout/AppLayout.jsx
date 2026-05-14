import {
  CalendarDays,
  Home,
  LogOut,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/useAuth.js";
import logoAgendat from "@/assets/logoAgendat.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/events", label: "Events", icon: CalendarDays },
  { to: "/events/new", label: "Create event", icon: Plus },
];

export function AppLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { organization, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const sidebar = (
    <aside className="app-sidebar">
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">
          <img src={logoAgendat} alt="" />
        </span>
        <div>
          <strong>Agenda&apos;t</strong>
          <span>Backoffice</span>
        </div>
      </div>
      <nav className="app-nav" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/events"}
              onClick={() => setIsNavOpen(false)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );

  return (
    <div className="app-shell">
      {sidebar}
      <div className="mobile-drawer" data-open={isNavOpen}>
        <button
          className="mobile-drawer__backdrop"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsNavOpen(false)}
        />
        <button
          className="icon-button mobile-drawer__close"
          type="button"
          aria-label="Close menu"
          onClick={() => setIsNavOpen(false)}
        >
          <X size={20} />
        </button>
        <div className="mobile-drawer__panel">{sidebar}</div>
      </div>
      <div className="app-main">
        <header className="topbar">
          <button
            className="icon-button topbar__menu"
            type="button"
            aria-label="Open menu"
            onClick={() => setIsNavOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="topbar__identity">
            <strong>{organization?.name ?? "Organization"}</strong>
            <span>{user?.email ?? user?.username ?? "Client workspace"}</span>
          </div>
          <button className="button button--ghost" type="button" onClick={handleLogout}>
            <LogOut size={17} />
            <span>Sign out</span>
          </button>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
