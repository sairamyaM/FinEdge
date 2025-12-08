const transactionService = require("../services/transactionService");

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const createTransaction = asyncHandler(async (req, res) => {
  const created = await transactionService.create(req.body, req.user.id);
  res.status(201).json(created);
});

const getAllTransactions = asyncHandler(async (req, res) => {
  const list = await transactionService.findAll(req.query, req.user.id);
  res.pretty(list);
});

const getTransactionById = asyncHandler(async (req, res) => {
  const item = await transactionService.findById(req.params.id, req.user.id);
  if (!item) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  res.pretty(item);
});

const updateTransaction = asyncHandler(async (req, res) => {
  const updated = await transactionService.update(req.params.id, req.body, req.user.id);
  if (!updated) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  res.pretty(updated);
});

const deleteTransaction = asyncHandler(async (req, res) => {
  const deleted = await transactionService.remove(req.params.id, req.user.id);
  if (!deleted) {
    return res.status(404).json({ message: "Transaction not found" });
  }
  res.status(204).send();
});

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
};
