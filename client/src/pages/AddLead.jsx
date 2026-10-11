import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLead } from "../services/api";
import LeadForm from "../components/LeadForm";

// Starting (empty) values for a new lead
const emptyLead = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  priority: "Medium",
  status: "New",
  followUpDate: "",
  note: "",
};

export default function AddLead() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData) {
    setSaving(true);
    setError("");

    try {
      await createLead(formData);
      // Go to the list and show the success message there
      navigate("/leads", { state: { message: "Lead added successfully!" } });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Add Lead</h2>
          <p className="muted">Fill in the details of the new lead</p>
        </div>
      </div>

      <LeadForm
        initialData={emptyLead}
        onSubmit={handleSubmit}
        saving={saving}
        error={error}
        buttonText="Add Lead"
      />
    </div>
  );
}
