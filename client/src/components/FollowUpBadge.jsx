import { getFollowUpCategory } from "../utils";

// Shows "Due Today", "Overdue" or "Upcoming" for a lead.
// Shows nothing when there is no follow-up to do.
export default function FollowUpBadge({ lead }) {
  const category = getFollowUpCategory(lead);

  if (category === "today") return <span className="badge followup-today">Due Today</span>;
  if (category === "overdue") return <span className="badge followup-overdue">Overdue</span>;
  if (category === "upcoming") return <span className="badge followup-upcoming">Upcoming</span>;
  return null;
}
