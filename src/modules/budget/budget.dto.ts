import type { Budgets, Category } from '@generated/prisma/client';


export interface CreateBudgetDto {
    maxAmount: number;
    color: string;
    category: Category
}

export interface UpdateBudgetDto {
    maxAmount: number;
    color: string;
    category: Category
}

export interface BudgetResponseDto {
    id: number;
    maxAmount: number;
    color: string;
    category: Category
}

export class BudgetMapper {
    static toResponseDto(budget: Budgets ) : BudgetResponseDto {
        return {
            id: budget.id,
            maxAmount: Number(budget.maxAmount),
            color: budget.color,
            category: budget.category
        }
    }
}