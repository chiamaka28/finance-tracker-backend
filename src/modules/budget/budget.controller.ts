import type { Response } from "express";
import type {CreateBudgetDto,  UpdateBudgetDto } from './budget.dto';
import type { AuthRequest } from "@/middleware/auth";
import { createBudgetService, getBudgetService, updateBudgetService, deleteBudgetService } from "./budget.service";


export class BudgetController {
    async createBudget (req: AuthRequest, res: Response) : Promise<void> {
        try {
           const userId = Number(req.user?.id);
           const dto: CreateBudgetDto = req.body;
           const budget = await createBudgetService(userId, dto);


           res.status(201).json({
               success: true,
               message: 'Budget created successfully',
               data: { result: budget},
           });
        } catch (error: any) {
            console.log('Error creating budget:', error);
            switch (error.status) {
                case 400:
                    res
                    .status(400)
                    .json({ success: false, message: error.message || 'Bad Request'});
                    break;
                default:
                    res
                       .status(500)
                       .json({ success: false, message: 'Internal Server Error'});

            }
        }
    }

    async getBudgets (req: AuthRequest, res: Response) : Promise<void> {
        try {
            const userId = Number(req.user?.id);
            const budgets = await getBudgetService(userId);

            res.status(200).json({
                success: true,
                message: 'Budgets fetched successfully',
                data: { results: budgets },
            });
        } catch (error: any) {
          switch (error.status) {
            case 400:
                res
                .status(400)
                .json({ success: false, message: error.message || 'Bad Request' });
                break;
            default:
                res
                .status(500)
                .json({ success: false, message: 'Internal Server Error' });
            }
        }
    }

    
    async updateBudget(req: AuthRequest, res: Response): Promise<void> {
        try {
          const userId = Number(req.user?.id);
          const id = Number(req.params.id);
          const dto: UpdateBudgetDto = req.body;
          const budget = await updateBudgetService(userId, id, dto);

          res.status(200).json({
            success: true,
            message: 'Budget updated successfully',
            data: { result: budget },
    });
        } catch (error: any) {
            console.log('Error updating budget:', error);
            switch (error.status) {
                case 400:
                    res
                    .status(400)
                    .json({ success: false, message: error.message || 'Bad Request' });
                    break;
                default:
                    res
                    .status(500)
                    .json({ success: false, message: 'Internal Server Error' });
                }
        }
    
   } 

   async deleteBudget(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = Number(req.user?.id);
    const id = Number(req.params.id);
    await deleteBudgetService(userId, id);

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error : any) {
    console.error('Error deleting budget:', error);
    switch (error.status) {
      case 400:
        res
          .status(400)
          .json({ success: false, message: error.message || 'Bad Request' });
        break;
      default:
        res
          .status(500)
          .json({ success: false, message: 'Internal Server Error' });
    }
        }
}
}

