import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  KanbanSquare,
  CalendarDays,
  BarChart3,
  UserRound,
  Leaf,
  Plus,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Applications",
      path: "/dashboard/applications",
      icon: BriefcaseBusiness,
    },
    {
      name: "Tracker",
      path: "/dashboard/kanban",
      icon: KanbanSquare,
    },
    {
      name: "Calendar",
      path: "/dashboard/calendar",
      icon: CalendarDays,
    },
    {
      name: "Companies",
      path: "/dashboard/companies",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/dashboard" className="sidebar-logo">
        <div>
          <div className="logo-name">TrackHire</div>

          <div className="logo-subtitle">
            Your journey to the right job.
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/dashboard"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={17} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <div className="tip-icon">
            <Leaf size={28} />
          </div>

          <h4>Stay organized.</h4>
          <h4>Stay ahead.</h4>

          <p>
            Track your progress and land your dream job.
          </p>

          <Link
            to="/dashboard/applications"
            className="sidebar-add"
          >
            <Plus size={15} />
            Add Application
          </Link>
        </div>
      </div>
    </aside>
  );
}