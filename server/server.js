// LeadFlow - Express server
// Starts the API on port 5000. Leads are stored in data/leads.json

const express = require("express");
const cors = require("cors");
const leadRoutes = require("./routes/leadRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the React app (running on another port) to call this API
app.use(cors());

// Let Express read JSON sent from React
app.use(express.json());

// All lead routes start with /api/leads
app.use("/api/leads", leadRoutes);

// Any other /api URL does not exist
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Catch-all error handler (for example: broken JSON in the request)
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON data" });
  }
  console.error(err);
  res.status(500).json({ message: "Server error. Please try again." });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log("LeadFlow server running at http://localhost:" + PORT);
  });
}

module.exports = app;
