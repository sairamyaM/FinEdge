const { body, validationResult } = require("express-validator");

const validateCreateTransaction = [
  body("type")
    .exists().withMessage("Type is required")
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("amount")
    .exists().withMessage("Amount is required")
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),

  body("category").optional().isString(),
  body("date").optional().isISO8601(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validateUpdateTransaction = [
  body("type")
    .optional()
    .isIn(["income", "expense"]).withMessage("Type must be income or expense"),

  body("amount")
    .optional()
    .isFloat({ gt: 0 }).withMessage("Amount must be a positive number"),

  body("category").optional().isString(),
  body("date").optional().isISO8601(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCreateTransaction, validateUpdateTransaction };
