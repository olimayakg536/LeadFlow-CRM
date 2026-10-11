// All the logic for reading and changing leads.
// Data is stored in server/data/leads.json (no database).

const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

const DEFAULT_DATA_FILE = path.join(__dirname, "..", "data", "leads.json");
const DATA_FILE = process.env.VERCEL
  ? path.join("/tmp", "leads.json")
  : DEFAULT_DATA_FILE;

// Allowed values
const SOURCES = ["Website", "LinkedIn", "Referral", "Advertisement", "Other"];
const STATUSES = ["New", "Contacted", "Follow-up", "Converted", "Lost"];
const PRIORITIES = ["High", "Medium", "Low"];

// ---------- Helper functions ----------

// Read all leads from the JSON file
async function readLeads() {
  try {
    if (process.env.VERCEL && !fsSync.existsSync(DATA_FILE)) {
      const initialData = await fs.readFile(DEFAULT_DATA_FILE, "utf8");
      await fs.writeFile(DATA_FILE, initialData, "utf8");
    }
    const text = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(text);
  } catch (error) {
    // If the file does not exist yet, create an empty one
    if (error.code === "ENOENT") {
      await writeLeads([]);
      return [];
    }
    throw error;
  }
}

// Save all leads to the JSON file
async function writeLeads(leads) {
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2));
}

// Today's date as "YYYY-MM-DD"
function todayString() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

// Check the id in the URL. Returns the number, or null if it is not valid.
function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Check the data sent from the form.
// Returns an error message, or null if everything is fine.
function validateLead(body) {
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();

  if (!name) return "Name is required";
  if (!email) return "Email is required";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) return "Please enter a valid email address";

  if (body.source && !SOURCES.includes(body.source)) return "Invalid source";
  if (body.status && !STATUSES.includes(body.status)) return "Invalid status";
  if (body.priority && !PRIORITIES.includes(body.priority)) return "Invalid priority";

  if (body.followUpDate && !/^\d{4}-\d{2}-\d{2}$/.test(body.followUpDate)) {
    return "Follow-up date must look like YYYY-MM-DD";
  }

  return null;
}

// Pick only the fields we want from the request and clean them
function cleanLeadData(body) {
  return {
    name: body.name.trim(),
    email: body.email.trim(),
    phone: (body.phone || "").trim(),
    company: (body.company || "").trim(),
    source: body.source || "Other",
    status: body.status || "New",
    priority: body.priority || "Medium",
    note: (body.note || "").trim(),
    followUpDate: body.followUpDate || "",
  };
}

function serverError(res, error) {
  console.error(error);
  res.status(500).json({ message: "Server error. Please try again." });
}

// ---------- Controller functions ----------

// GET /api/leads  -> all leads
async function getAllLeads(req, res) {
  try {
    const leads = await readLeads();
    res.json(leads);
  } catch (error) {
    serverError(res, error);
  }
}

// GET /api/leads/:id  -> one lead
async function getLeadById(req, res) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid lead ID" });

    const leads = await readLeads();
    const lead = leads.find((l) => l.id === id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    res.json(lead);
  } catch (error) {
    serverError(res, error);
  }
}

// POST /api/leads  -> add a new lead
async function createLead(req, res) {
  try {
    const body = req.body || {};
    const problem = validateLead(body);
    if (problem) return res.status(400).json({ message: problem });

    const leads = await readLeads();

    // New id = biggest existing id + 1
    const newId = leads.length > 0 ? Math.max(...leads.map((l) => l.id)) + 1 : 1;

    const newLead = {
      id: newId,
      ...cleanLeadData(body),
      createdAt: todayString(),
    };

    leads.push(newLead);
    await writeLeads(leads);
    res.status(201).json(newLead);
  } catch (error) {
    serverError(res, error);
  }
}

// PUT /api/leads/:id  -> update a lead
async function updateLead(req, res) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid lead ID" });

    const body = req.body || {};
    const problem = validateLead(body);
    if (problem) return res.status(400).json({ message: problem });

    const leads = await readLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return res.status(404).json({ message: "Lead not found" });

    // Keep id and createdAt, replace everything else
    leads[index] = {
      id: leads[index].id,
      ...cleanLeadData(body),
      createdAt: leads[index].createdAt,
    };

    await writeLeads(leads);
    res.json(leads[index]);
  } catch (error) {
    serverError(res, error);
  }
}

// DELETE /api/leads/:id  -> remove a lead
async function deleteLead(req, res) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid lead ID" });

    const leads = await readLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return res.status(404).json({ message: "Lead not found" });

    leads.splice(index, 1);
    await writeLeads(leads);
    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    serverError(res, error);
  }
}

// PATCH /api/leads/:id/status  -> change only the status
async function updateStatus(req, res) {
  try {
    const id = parseId(req.params.id);
    if (id === null) return res.status(400).json({ message: "Invalid lead ID" });

    const status = (req.body || {}).status;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leads = await readLeads();
    const lead = leads.find((l) => l.id === id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    lead.status = status;
    await writeLeads(leads);
    res.json(lead);
  } catch (error) {
    serverError(res, error);
  }
}

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateStatus,
};
