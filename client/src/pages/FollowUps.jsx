import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLeads } from "../services/api";
import { getFollowUpCategory, formatShortDate } from "../utils";
import StatusBadge from "../components/StatusBadge";

// One small card for a lead inside a follow-up group
function FollowUpItem({ lead }) {
  return (
    <div className="card followup-item">
      <div>
        <h4>{lead.name}</h4>
        <p className="muted small">{lead.company || "No company"}</p>
        <p>Follow-up: {formatShortDate(lead.followUpDate)}</p>
        <p>Status: <StatusBadge status={lead.status} /></p>
      </div>
      <Link to={"/leads/" + lead.id} className="btn btn-small btn-view">View Lead</Link>
    </div>
  );
}

// One group (Due Today / Upcoming / Overdue)
function FollowUpGroup({ title, className, leads, emptyText }) {
  return (
    <section className="followup-group">
      <h3 className={"group-title " + className}>
        {title} <span className="count">{leads.length}</span>
      </h3>
      {leads.length === 0 ? (
        <p className="muted">{emptyText}</p>
      ) : (
        <div className="lead-grid">
          {leads.map((lead) => (
            <FollowUpItem key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function FollowUps() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLeads()
      .then((data) => setLeads(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="muted">Loading follow-ups...</p>;
  if (error) return <div className="message error">{error}</div>;

  // Put each lead in the right group using its follow-up date.
  // Dates in YYYY-MM-DD format can be sorted like normal text.
  const byDate = (a, b) => a.followUpDate.localeCompare(b.followUpDate);
  const dueToday = leads.filter((l) => getFollowUpCategory(l) === "today").sort(byDate);
  const upcoming = leads.filter((l) => getFollowUpCategory(l) === "upcoming").sort(byDate);
  const overdue = leads.filter((l) => getFollowUpCategory(l) === "overdue").sort(byDate);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Follow-ups</h2>
          <p className="muted">Leads that still need your attention (Converted and Lost leads are not shown)</p>
        </div>
      </div>

      <FollowUpGroup title="Due Today" className="today" leads={dueToday} emptyText="No follow-ups due today." />
      <FollowUpGroup title="Upcoming" className="upcoming" leads={upcoming} emptyText="No upcoming follow-ups." />
      <FollowUpGroup title="Overdue" className="overdue" leads={overdue} emptyText="No overdue follow-ups." />
    </div>
  );
}
