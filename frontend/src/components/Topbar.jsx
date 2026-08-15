import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const name =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "User";

  const initial = name.charAt(0).toUpperCase();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="topbar">
      {/* SEARCH */}
      <div className="topbar-search">
        <Search size={15} />

        <input
          type="text"
          placeholder="Search jobs, companies..."
        />
      </div>

      <div className="topbar-right">
        {/* NOTIFICATION */}
        <button className="icon-button">
          <Bell size={17} />
        </button>

        {/* USER */}
        <div className="user-wrapper" ref={dropdownRef}>
          <button
            className="user-profile"
            onClick={() => setOpen(!open)}
          >
            <div className="avatar">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={name} />
              ) : (
                initial
              )}
            </div>

            <span>{name}</span>

            <ChevronDown
              size={14}
              className={open ? "chevron-open" : ""}
            />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="user-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-avatar">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={name} />
                  ) : (
                    initial
                  )}
                </div>

                <div>
                  <strong>{name}</strong>

                  <small>
                    {user?.emailAddresses?.[0]?.emailAddress}
                  </small>
                </div>
              </div>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
              >
                <User size={16} />
                <span>Profile</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setOpen(false);
                  openUserProfile();
                }}
              >
                <Settings size={16} />
                <span>Manage Account</span>
              </button>

              <div className="dropdown-divider" />

              <button
                className="dropdown-item logout"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}