import type {
  expensesDetailSelect,
  expensesListSelect,
} from "../../constants/expenses.constant.js";
import type { ExpenseGetPayload } from "../../generated/prisma/models.js";

export type ExpensesWithListSelect = ExpenseGetPayload<{
  select: typeof expensesListSelect;
}>;

export type ExpensesWithDetailSelect = ExpenseGetPayload<{
  select: typeof expensesDetailSelect;
}>;
