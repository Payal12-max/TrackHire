import { Search, Bell, ChevronDown } from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={15} />

        <input
          type="text"
          placeholder="Search jobs, companies..."
        />
      </div>

      <div className="topbar-right">
        <button className="icon-button">
          <Bell size={17} />
        </button>

        <div className="user-profile">
          <div className="avatar">P</div>

          <span>Payal</span>

          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
}