const TransactionModel = require("../models/transactionModel");
const { v4: uuidv4 } = require("uuid");

async function create(payload) {
  const tx = {
    id: uuidv4(),
    type: payload.type,
    category: payload.category || "general",
    amount: Number(payload.amount),
    date: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
    note: payload.note || ""
  };

  await TransactionModel.insert(tx);
  return tx;
}

async function findAll(query) {
  return TransactionModel.find(query);
}

async function findById(id) {
  return TransactionModel.findById(id);
}

async function update(id, payload) {
  return TransactionModel.update(id, payload);
}

async function remove(id) {
  return TransactionModel.remove(id);
}

module.exports = { create, findAll, findById, update, remove };
