const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");
const auth = require("../middleware/auth");
const { validateUpdateTransaction, validateCreateTransaction } = require("../middleware/validator");

router.post("/", auth, validateCreateTransaction, createTransaction);

router.get("/", auth, getAllTransactions);

router.get("/:id", auth, getTransactionById);

router.patch("/:id", auth, validateUpdateTransaction, updateTransaction);

router.delete("/:id", auth, deleteTransaction);

module.exports = router;
