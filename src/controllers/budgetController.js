const budgetService = require("../services/budgetService");
const asyncHandler = require("../utils/asyncHandler");

const setBudget = asyncHandler(async (req, res) => {
  const result = await budgetService.setBudget(req.user.id, req.body);
  res.status(201).pretty(result);
});

const getBudget = asyncHandler(async (req, res) => {
  const month = req.query.month;
  const result = await budgetService.getBudget(req.user.id, month);
  res.pretty(result);
});

const getBudgetSummary = asyncHandler(async (req, res) => {
  const month = req.query.month;
  const summary = await budgetService.getBudgetSummary(req.user.id, month);
  res.pretty(summary);
});

module.exports = {
  setBudget,
  getBudget,
  getBudgetSummary
};
