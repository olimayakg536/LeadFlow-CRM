import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getLead, updateLead } from "../services/api";
import LeadForm from "../components/LeadForm";

export default function EditLead() {
  const { id } = useParams(); // the id from the URL: /leads/:id/edit
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load the lead so the form can be filled with its current values
  useEffect(() => {
    getLead(id)
      .then((data) => setLead(data))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");

    try {
      await updateLead(id, formData);
      navigate("/leads/" + id, { state: { message: "Lead updated successfully!" } });
    } catch (err) {
      setError(err.message);
      setSaving(false);
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
          <h2>Edit Lead</h2>
          <p className="muted">Update the details of {lead.name}</p>
        </div>
      </div>

      <LeadForm
        initialData={lead}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        buttonText="Save Changes"
      />
    </div>
  );
}
