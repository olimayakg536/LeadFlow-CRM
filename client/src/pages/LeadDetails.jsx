import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { getLead, deleteLead, updateStatus } from "../services/api";
import { STATUSES, formatDate } from "../utils";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import FollowUpBadge from "../components/FollowUpBadge";
import LeadJourney from "../components/LeadJourney";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // The value chosen in the "Change Status" dropdown
  const [newStatus, setNewStatus] = useState("");

  const [message, setMessage] = useState(location.state ? location.state.message : "");
  const [error, setError] = useState("");

  // Load the lead
  useEffect(() => {
    getLead(id)
      .then((data) => {
        setLead(data);
        setNewStatus(data.status);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));

    // Clear the message stored in the page history so a refresh will not show it again
    if (location.state) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Hide the message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  // "Update Status" button
  async function handleStatusUpdate() {
    setError("");
    try {
      const updated = await updateStatus(id, newStatus);
      setLead(updated);
      setMessage("Status changed to " + updated.status + "!");
    } catch (err) {
      setError(err.message);
    }
  }

  // "Delete Lead" button
  async function handleDelete() {
    const sure = window.confirm("Are you sure you want to delete this lead?");
    if (!sure) return;

    try {
      await deleteLead(id);
      navigate("/leads", { state: { message: "Lead deleted successfully!" } });
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="muted">Loading lead...</p>;

  if (loadError) {
    return (
      <div className="card empty-state">
        <div className="message error">{loadError}</div>
        <Link to="/leads" className="btn btn-primary">Back to Leads</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Lead Details</h2>
        </div>
        <Link to="/leads" className="btn btn-gray">Back to Leads</Link>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="details-layout">
        {/* Left side: lead information */}
        <div>
          <div className="card details-header">
            <h2>{lead.name}</h2>
            <p>{lead.company || "No company"}</p>
            <p className="muted">{lead.email}</p>
            <p className="muted">{lead.phone || "No phone number"}</p>
          </div>

          <div className="card">
            <div className="detail-row">
              <span className="label">Source</span> {lead.source}
            </div>
            <div className="detail-row">
              <span className="label">Priority</span> <PriorityBadge priority={lead.priority} />
            </div>
            <div className="detail-row">
              <span className="label">Status</span> <StatusBadge status={lead.status} />
            </div>
            <div className="detail-row">
              <span className="label">Follow-up</span> {formatDate(lead.followUpDate)}{" "}
              <FollowUpBadge lead={lead} />
            </div>
            <div className="detail-row">
              <span className="label">Created</span> {formatDate(lead.createdAt)}
            </div>

            <h4>Note</h4>
            <p className="note-text">{lead.note || "No note added."}</p>
          </div>

          {/* Quick status update */}
          <div className="card">
            <h4>Change Status</h4>
            <div className="status-update">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button className="btn btn-primary" onClick={handleStatusUpdate}>
                Update Status
              </button>
            </div>
          </div>

          <div className="details-actions">
            <Link to={"/leads/" + lead.id + "/edit"} className="btn btn-edit">Edit Lead</Link>
            <button className="btn btn-delete" onClick={handleDelete}>Delete Lead</button>
          </div>
        </div>

        {/* Right side: the Lead Journey */}
        <div className="card">
          <h3>Lead Journey</h3>
          <LeadJourney status={lead.status} />
        </div>
      </div>
    </div>
  );
}
