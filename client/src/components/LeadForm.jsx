import { useState } from "react";
import { Link } from "react-router-dom";
import { SOURCES, STATUSES, PRIORITIES } from "../utils";

// The form used by both the Add Lead and Edit Lead pages.
//   initialData - the starting values of the form
//   onSubmit    - function called with the form data when Save is clicked
//   saving      - true while the request is being sent
//   error       - error message to show (if any)
export default function LeadForm({ initialData, onSubmit, saving, error, buttonText }) {
  const [form, setForm] = useState(initialData);

  // Update one field in the form state
  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault(); // stop the page from reloading
    onSubmit(form);
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      {error && <div className="message error">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input id="company" name="company" value={form.company} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="source">Source</label>
          <select id="source" name="source" value={form.source} onChange={handleChange}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="followUpDate">Follow-up Date</label>
          <input id="followUpDate" name="followUpDate" type="date" value={form.followUpDate} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="note">Note</label>
        <textarea id="note" name="note" rows="4" value={form.note} onChange={handleChange} />
      </div>

      <div className="form-buttons">
        <Link to="/leads" className="btn btn-gray">Cancel</Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : buttonText}
        </button>
      </div>
    </form>
  );
}
