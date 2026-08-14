import { getTransactionSummary, getAllTransactions } from '../transaction/transaction.service';
import { getBudgetService } from '../budget/budget.service';
import { getPotService } from '../pots/pots.service';
import type { Transactions } from '@generated/prisma/client';
import type{ PotResponseDto } from '../pots/pots.dto';

export const getOverviewService = async (userId: number) => {

    const [summary, budgets, pots, transactions] = await Promise.all([
    getTransactionSummary(userId),
    getBudgetService(userId),
    getPotService(userId),
    getAllTransactions(userId),
  
    ]);

    const totalSaved = pots.reduce((sum: number, pot: PotResponseDto) => sum + Number(pot.total), 0);
    const latestPots = pots.slice(0, 4);

    const { totalSpentAllCategories, totalMaxAmount, totalFree, results: budgetResults } = budgets;
    const latestBudgets = budgetResults.slice(0, 4).map(({ latestTransactions: _, ...budget }) => budget);

    const { transactions: allTransactions } = transactions;
    const normalizedTransactions = (allTransactions as Transactions[]).map((t: Transactions) => ({
      ...t,
      amount: Number(t.amount),
    }));

const latestTransactions = normalizedTransactions.slice(0, 5);
const recurringBills = normalizedTransactions.filter((t) => t.recurring).slice(0, 3);
    return {
  ...summary,
  pots: {
    totalSaved,
    latest: latestPots,
  },
  budgets: {
    totalSpentAllCategories,
    totalMaxAmount,
    totalFree,
    latest: latestBudgets,
  },
  transactions: {
    latest: latestTransactions,
    recurringBills,
  },
};
}