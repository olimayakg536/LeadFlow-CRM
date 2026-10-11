import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeads } from "../services/api";
import { getFollowUpCategory, formatDate } from "../utils";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all leads once when the page opens
  useEffect(() => {
    getLeads()
      .then((data) => setLeads(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading dashboard...</p>;
  if (error) return <div className="message error">{error}</div>;

  // Simple counting with .filter()
  const countStatus = (status) => leads.filter((l) => l.status === status).length;
  const countPriority = (priority) => leads.filter((l) => l.priority === priority).length;

  const stats = [
    { label: "Total Leads", value: leads.length, className: "stat-total" },
    { label: "New", value: countStatus("New"), className: "stat-new" },
    { label: "Contacted", value: countStatus("Contacted"), className: "stat-contacted" },
    { label: "Follow-up", value: countStatus("Follow-up"), className: "stat-followup" },
    { label: "Converted", value: countStatus("Converted"), className: "stat-converted" },
    { label: "Lost", value: countStatus("Lost"), className: "stat-lost" },
  ];

  // Leads whose follow-up date is today
  const todaysFollowUps = leads.filter((l) => getFollowUpCategory(l) === "today");

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p className="muted">A quick look at all your leads</p>
        </div>
        <Link to="/leads/add" className="btn btn-primary">+ Add Lead</Link>
      </div>

      {/* Status cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={"card stat-card " + stat.className}>
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="two-columns">
        {/* Priority summary */}
        <div className="card">
          <h3>Priority Summary</h3>
          <ul className="summary-list">
            <li><PriorityBadge priority="High" /> <strong>{countPriority("High")}</strong></li>
            <li><PriorityBadge priority="Medium" /> <strong>{countPriority("Medium")}</strong></li>
            <li><PriorityBadge priority="Low" /> <strong>{countPriority("Low")}</strong></li>
          </ul>
        </div>

        {/* Today's follow-ups */}
        <div className="card">
          <h3>Today's Follow-ups</h3>
          {todaysFollowUps.length === 0 ? (
            <p className="muted">No follow-ups scheduled for today.</p>
          ) : (
            <ul className="summary-list">
              {todaysFollowUps.map((lead) => (
                <li key={lead.id} className="followup-row">
                  <div>
                    <strong>{lead.name}</strong>
                    <p className="muted small">
                      {lead.company || "No company"} · {formatDate(lead.followUpDate)}
                    </p>
                  </div>
                  <div className="row-right">
                    <StatusBadge status={lead.status} />
                    <Link to={"/leads/" + lead.id} className="btn btn-small btn-view">View</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
