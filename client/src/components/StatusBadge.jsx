// Small colored label for a lead's status.
// "Follow-up" becomes the CSS class "status-follow-up"
export default function StatusBadge({ status }) {
  const className = "badge status-" + status.toLowerCase();
  return <span className={className}>{status}</span>;
}
