const TransactionModel = require("../models/transactionModel");
const { v4: uuidv4 } = require("uuid");


function applyFilters(transactions, filters) {
  let result = transactions;

  if (filters.type) {
    result = result.filter(t => t.type === filters.type);
  }

  if (filters.category) {
    result = result.filter(t => t.category === filters.category);
  }

  if (filters.from) {
    result = result.filter(t => new Date(t.date) >= new Date(filters.from));
  }

  if (filters.to) {
    result = result.filter(t => new Date(t.date) <= new Date(filters.to));
  }

  return result;
}


async function create(payload, userId) {
  return TransactionModel.insert({
    id: uuidv4(),
    userId,
    ...payload,
    date: payload.date || new Date().toISOString()
  });
}


async function findAll(filters, userId) {
  const all = await TransactionModel.find();
  const userTx = all.filter(tx => tx.userId === userId);
  return applyFilters(userTx, filters);
}

async function findById(id) {
  return TransactionModel.findById(id);
}

async function update(id, patch, userId) {
  const tx = await TransactionModel.findById(id);
  if (!tx) return null;

  if (tx.userId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  return TransactionModel.update(id, patch);
}


async function remove(id, userId) {
  const tx = await TransactionModel.findById(id);
  if (!tx) return false;

  if (tx.userId !== userId) {
    throw new AppError("Not authorized", 403);
  }

  return TransactionModel.remove(id);
}


module.exports = { create, findAll, findById, update, remove };
