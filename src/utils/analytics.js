const TransactionModel = require("../models/transactionModel");

async function computeSummary() {
  const all = await TransactionModel.find();
  
  const totalIncome = all
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = all
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    count: all.length,
  };
}

module.exports = { computeSummary };
