const BudgetModel = require("../models/budgetModel");
const TransactionModel = require("../models/transactionModel");
const AppError = require("../utils/AppError");

function getMonthKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}


async function setBudget(userId, payload) {
  const month = payload.month || getMonthKey();

  const existing = await BudgetModel.findByUserAndMonth(userId, month);
  if (existing) {
    throw new AppError("Budget already set for this month", 400);
  }

  const newBudget = {
    userId,
    month,
    budgetAmount: Number(payload.budgetAmount),
    savingsTarget: Number(payload.savingsTarget)
  };

  return BudgetModel.insert(newBudget);
}

async function getBudget(userId, month = getMonthKey()) {
  const budget = await BudgetModel.findByUserAndMonth(userId, month);

  if (!budget) {
    throw new AppError("No budget found for this month", 404);
  }

  return budget;
}

async function getBudgetSummary(userId, month = getMonthKey()) {
  const budget = await getBudget(userId, month);

  const all = await TransactionModel.find();
  const userTx = all.filter((t) => t.userId === userId);

  const monthTx = userTx.filter((t) => t.date.startsWith(month));

  const totalIncome = monthTx
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = monthTx
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    month,
    budgetAmount: budget.budgetAmount,
    savingsTarget: budget.savingsTarget,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    status:
      totalExpense > budget.budgetAmount ? "over-budget" : "within-budget",
    amountLeft: budget.budgetAmount - totalExpense
  };
}

module.exports = {
  setBudget,
  getBudget,
  getBudgetSummary
};
