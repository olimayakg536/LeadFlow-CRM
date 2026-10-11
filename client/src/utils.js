// Small helper values and functions used in many places

export const SOURCES = ["Website", "LinkedIn", "Referral", "Advertisement", "Other"];
export const STATUSES = ["New", "Contacted", "Follow-up", "Converted", "Lost"];
export const PRIORITIES = ["High", "Medium", "Low"];

// The steps of the Lead Journey (Lost is shown separately)
export const JOURNEY_STEPS = ["New", "Contacted", "Follow-up", "Converted"];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Today's date as "YYYY-MM-DD" (uses the computer's local date)
export function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// "2026-10-10" -> "10 October 2026"
export function formatDate(dateString) {
  if (!dateString) return "Not set";
  const [year, month, day] = dateString.split("-");
  return Number(day) + " " + MONTHS[Number(month) - 1] + " " + year;
}

// "2026-10-05" -> "05 Oct 2026"
export function formatShortDate(dateString) {
  if (!dateString) return "Not set";
  const [year, month, day] = dateString.split("-");
  return day + " " + MONTHS[Number(month) - 1].slice(0, 3) + " " + year;
}

// Decide if a lead's follow-up is "today", "upcoming" or "overdue".
// Returns null when there is nothing to follow up
// (no date, or the lead is already Converted or Lost).
// Dates in YYYY-MM-DD format can be compared like normal text.
export function getFollowUpCategory(lead) {
  if (!lead.followUpDate) return null;
  if (lead.status === "Converted" || lead.status === "Lost") return null;

  const today = todayString();
  if (lead.followUpDate === today) return "today";
  if (lead.followUpDate < today) return "overdue";
  return "upcoming";
}
