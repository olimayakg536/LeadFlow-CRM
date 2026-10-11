// High = red, Medium = yellow, Low = green (colors are in index.css)
export default function PriorityBadge({ priority }) {
  const className = "badge priority-" + priority.toLowerCase();
  return <span className={className}>{priority}</span>;
}
