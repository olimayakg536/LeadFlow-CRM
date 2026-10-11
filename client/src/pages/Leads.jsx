import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getLeads, deleteLead } from "../services/api";
import { STATUSES, PRIORITIES } from "../utils";
import LeadCard from "../components/LeadCard";

export default function Leads() {
  const location = useLocation();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Success message (also used when we arrive here after Add / Edit / Delete)
  const [message, setMessage] = useState(location.state ? location.state.message : "");

  // Search box and the two dropdown filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  // Load leads when the page opens
  useEffect(() => {
    getLeads()
      .then((data) => setLeads(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Clear the message stored in the page history so a refresh will not show it again
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hide the message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // Delete a lead (after asking the user)
  async function handleDelete(lead) {
    const sure = window.confirm("Are you sure you want to delete this lead?");
    if (!sure) return;

    try {
      await deleteLead(lead.id);
      // Remove it from the list on screen
      setLeads(leads.filter((l) => l.id !== lead.id));
      setError("");
      setMessage("Lead deleted successfully!");
    } catch (err) {
      setError(err.message);
    }
  }

  // Search + both filters work together
  const searchText = search.trim().toLowerCase();
  const visibleLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchText) ||
      lead.email.toLowerCase().includes(searchText) ||
      (lead.company || "").toLowerCase().includes(searchText);

    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>All Leads</h2>
          <p className="muted">{visibleLeads.length} of {leads.length} leads shown</p>
        </div>
        <Link to="/leads/add" className="btn btn-primary">+ Add Lead</Link>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, email or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priority</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="muted">Loading leads...</p>
      ) : visibleLeads.length === 0 ? (
        <div className="card empty-state">
          <p>No leads found.</p>
        </div>
      ) : (
        <div className="lead-grid">
          {visibleLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
