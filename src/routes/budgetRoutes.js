const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { setBudget, getBudget, getBudgetSummary } = require("../controllers/budgetController");

router.post("/", auth, setBudget);

router.get("/", auth, getBudget);

router.get("/summary", auth, getBudgetSummary);

module.exports = router;
