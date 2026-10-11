import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import PriorityBadge from "./PriorityBadge";
import FollowUpBadge from "./FollowUpBadge";
import { formatDate } from "../utils";

// One lead shown as a card on the Leads page
export default function LeadCard({ lead, onDelete }) {
  return (
    <div className="card lead-card">
      <div className="lead-card-header">
        <div>
          <h3>{lead.name}</h3>
          <p className="muted">{lead.company || "No company"}</p>
        </div>
        <PriorityBadge priority={lead.priority} />
      </div>

      <div className="lead-card-info">
        <p><span className="label">Email</span> {lead.email}</p>
        <p><span className="label">Source</span> {lead.source}</p>
        <p>
          <span className="label">Status</span> <StatusBadge status={lead.status} />
        </p>
        <p>
          <span className="label">Follow-up</span> {formatDate(lead.followUpDate)}{" "}
          <FollowUpBadge lead={lead} />
        </p>
      </div>

      <div className="lead-card-actions">
        <Link to={"/leads/" + lead.id} className="btn btn-small btn-view">View</Link>
        <Link to={"/leads/" + lead.id + "/edit"} className="btn btn-small btn-edit">Edit</Link>
        <button className="btn btn-small btn-delete" onClick={() => onDelete(lead)}>
          Delete
        </button>
      </div>
    </div>
  );
}
