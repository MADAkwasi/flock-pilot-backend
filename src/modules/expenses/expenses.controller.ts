import type { Response, Request } from "express";
import { expenseService } from "./expenses.service.js";
import { farmParamSchema } from "../farm/farm.scheme.js";
import { expenseParamSchema } from "./expenses.schema.js";
import { queryParamSchema } from "../sales/sales.schema.js";

export class ExpenseController {
  static async createExpense(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { farmId } = farmParamSchema.parse(req.params);

    const expense = await expenseService.createExpense(farmId, userId, body);

    res.status(201).json({
      status: "success",
      data: {
        expense,
      },
    });
  }

  static async updateExpense(req: Request, res: Response): Promise<void> {
    const { userId, body } = req;
    const { farmId, expenseId } = expenseParamSchema.parse(req.params);

    const expense = await expenseService.updateExpense(
      farmId,
      userId,
      expenseId,
      body,
    );

    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  }

  static async deleteExpense(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId, expenseId } = expenseParamSchema.parse(req.params);

    await expenseService.deleteExpense(farmId, userId, expenseId);

    res.status(200).json({
      status: "success",
      message: "Expense deleted successfully",
    });
  }

  static async getExpense(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId, expenseId } = expenseParamSchema.parse(req.params);

    const expense = await expenseService.getExpense(farmId, userId, expenseId);

    res.status(200).json({
      status: "success",
      data: {
        expense,
      },
    });
  }

  static async getExpenses(req: Request, res: Response): Promise<void> {
    const { userId } = req;
    const { farmId } = farmParamSchema.parse(req.params);
    const { flockId } = queryParamSchema.parse(req.query);

    const expenses = await expenseService.getFarmExpenses(
      farmId,
      userId,
      flockId,
    );

    res.status(200).json({
      status: "success",
      results: expenses.length,
      data: expenses,
    });
  }
}
