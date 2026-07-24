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
    where: { userId },
  });

  const budgetsWithDetails = await Promise.all(
    budgets.map(async (budget) => {
      const [latestTransactions, spentAggregate] = await Promise.all([
        prisma.transactions.findMany({
          where: { userId, category: budget.category },
          orderBy: { date: 'desc' },
          take: 3,
        }),
        prisma.transactions.aggregate({
          where: { userId, category: budget.category },
          _sum: { amount: true },
        }),
      ]);

      const totalSpent = Math.abs(Number(spentAggregate._sum.amount) || 0);
      const free = Number(budget.maxAmount) - totalSpent;

      return {
        ...budget,
        maxAmount: Number(budget.maxAmount),
        totalSpent,
        free,
        latestTransactions: latestTransactions.map((t) => ({
          ...t,
          amount: Number(t.amount),
        })),
      };
    })
  );

  const totalSpentAllCategories = budgetsWithDetails.reduce(
    (sum, budget) => sum + budget.totalSpent, 0
  );

  const totalMaxAmount = budgetsWithDetails.reduce(
    (sum, budget) => sum + budget.maxAmount, 0
  );

  const totalFree = totalMaxAmount - totalSpentAllCategories;

  return { totalSpentAllCategories, totalMaxAmount, totalFree, results: budgetsWithDetails };
};

export const deleteBudgetService = async(userId: number, budgetId: number) => {
    const Existing = await prisma.budgets.findFirst({
       where: { id: budgetId, userId }
    });
    if (!Existing) {
        throw new Error(`Budget with ID ${budgetId} not found for user ${userId}`);
    }

    await prisma.budgets.delete({ where: { id: budgetId } });
}