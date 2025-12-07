const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");
const { validateUpdateTransaction, validateCreateTransaction } = require("../middleware/validator");

router.post("/", validateCreateTransaction, createTransaction);

router.get("/", getAllTransactions);

router.get("/:id", getTransactionById);

router.patch("/:id", validateUpdateTransaction, updateTransaction);

router.delete("/:id", deleteTransaction);

module.exports = router;
