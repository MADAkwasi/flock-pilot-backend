import { Router } from "express";
import {
  validateBody,
  validateParams,
} from "../../middleware/validator.middleware.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { ExpenseController } from "./expenses.controller.js";
import {
  createExpenseSchema,
  expenseParamSchema,
  updateExpenseSchema,
} from "./expenses.schema.js";

const router: Router = Router();

router
  .route("/:farmId")
  .get(
    validateParams(farmParamSchema),
    catchAsync(ExpenseController.getExpenses),
  )
  .post(
    validateParams(farmParamSchema),
    validateBody(createExpenseSchema),
    catchAsync(ExpenseController.createExpense),
  );

router
  .route("/:farmId/expense/:expenseId")
  .get(
    validateParams(expenseParamSchema),
    catchAsync(ExpenseController.getExpense),
  )
  .patch(
    validateParams(expenseParamSchema),
    validateBody(updateExpenseSchema),
    catchAsync(ExpenseController.updateExpense),
  )
  .delete(
    validateParams(expenseParamSchema),
    catchAsync(ExpenseController.deleteExpense),
  );

export default router;
