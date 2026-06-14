import { Router } from "express";
import { BudgetController } from "./budget.controller";

const budgetRouter: Router = Router();
const budgetController = new BudgetController();

budgetRouter.post('/', budgetController.createBudget.bind(budgetController));
budgetRouter.get('/', budgetController.getBudgets.bind(budgetController));
budgetRouter.patch('/:id', budgetController.updateBudget.bind(budgetController));
budgetRouter.delete('/:id', budgetController.deleteBudget.bind(budgetController));

export default budgetRouter;