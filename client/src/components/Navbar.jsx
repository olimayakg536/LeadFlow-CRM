import { NavLink } from "react-router-dom";

// Sidebar on big screens, top menu on small screens (see index.css)
export default function Navbar() {
  // NavLink gives us "isActive" so we can highlight the current page
  function linkClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h1 className="logo">LeadFlow</h1>
        <nav className="nav-links">
          <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/leads" className={linkClass}>Leads</NavLink>
          <NavLink to="/followups" className={linkClass}>Follow-ups</NavLink>
        </nav>
      </div>

      <div className="sidebar-bottom">
        <strong>LeadFlow CRM</strong>
        <span>Simple Lead Management</span>
      </div>
    </aside>
  );
}
