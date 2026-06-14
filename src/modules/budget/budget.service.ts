import { prisma } from '../../db';
import {BudgetMapper, type CreateBudgetDto } from './budget.dto';

export const createBudgetService = async (userId: number, dto: CreateBudgetDto) => {
    const userExists = await prisma.user.findUnique({ where: {id: userId}});
    if (!userExists) {
        throw new Error(`User with ID ${userId} not found`);
    }

    const budget = await prisma.budgets.create({
        data: {
                    maxAmount: dto.maxAmount,
                    color: dto.color,
                    category: dto.category,
                    user: { connect: { id: userId } }
        }
    });

    return BudgetMapper.toResponseDto(budget);
}

export const updateBudgetService = async (userId: number, budgetId: number, dto: CreateBudgetDto) => {
    const Existing = await prisma.budgets.findFirst({ where: { id: budgetId, userId } });
    if (!Existing) {
        throw new Error(`Budget with ID ${budgetId} not found for user ${userId}`);
    }  


    const updatedBudget = await prisma.budgets.update({
        where: { id: budgetId },
        data: {
            maxAmount: dto.maxAmount,
            color: dto.color,
            category: dto.category
        }
    });

    return BudgetMapper.toResponseDto(updatedBudget);
}

export const getBudgetService = async (userId: number) => {
    const budgets = await prisma.budgets.findMany({
         where: { userId},
        
        });

    return budgets;
}

export const deleteBudgetService = async(userId: number, budgetId: number) => {
    const Existing = await prisma.budgets.findFirst({
       where: { id: budgetId, userId }
    });
    if (!Existing) {
        throw new Error(`Budget with ID ${budgetId} not found for user ${userId}`);
    }

    await prisma.budgets.deleteMany({ where: { id : budgetId }});
    await prisma.budgets.delete({ where: {id: budgetId}});
}