// Connects each URL to a function in the controller

const express = require("express");
const controller = require("../controllers/leadController");

const router = express.Router();

router.get("/", controller.getAllLeads); // GET    /api/leads
router.get("/:id", controller.getLeadById); // GET    /api/leads/:id
router.post("/", controller.createLead); // POST   /api/leads
router.put("/:id", controller.updateLead); // PUT    /api/leads/:id
router.delete("/:id", controller.deleteLead); // DELETE /api/leads/:id
router.patch("/:id/status", controller.updateStatus); // PATCH  /api/leads/:id/status

module.exports = router;
