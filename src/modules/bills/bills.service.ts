import { prisma } from '../../db'

interface Bill {
  amount: number;
  isPaid: boolean;
  dueSoon: boolean;
  dueDate: number;
}

export const getBillsService = async (
    userId: number,
    search?: string,
    sortBy?: string
) => {
  const sortOptions: Record<string, object> = {
  latest:  { date: 'desc' },
  oldest:  { date: 'asc' },
  aToZ:    { name: 'asc' },
  zToA:    { name: 'desc' },
  highest: { amount: 'desc' },
  lowest:  { amount: 'asc' },
};
  const recurringTransactions = await prisma.transactions.findMany({
  where: { 
    userId, 
    recurring: true,
    ...(search && { name: { contains: search } }),
  },
  orderBy: sortOptions[sortBy ?? ''] ?? { date: 'desc' },
});

  const today = new Date();
  const todayDay = today.getDate();

  const bills: Bill[] = recurringTransactions.map((t) => {
  const date = new Date(t.date);
  const dueDate = date.getDate();
  const isPaid = date < today;
  const dueSoon = !isPaid && (dueDate - todayDay) <= 5 && (dueDate - todayDay) >= 0;

  return {
    ...t,
    amount: Number(t.amount),
    dueDate,
    isPaid,
    dueSoon,
  };
});

const totalBills = bills.reduce((sum: number, bill: Bill) => sum + Math.abs(bill.amount), 0);

const paidBills = bills.filter((b: Bill) => b.isPaid);
const paidTotal = paidBills.reduce((sum: number, b: Bill) => sum + Math.abs(b.amount), 0);

const upcomingBills = bills.filter((b: Bill) => !b.isPaid);
const upcomingTotal = upcomingBills.reduce((sum: number, b: Bill) => sum + Math.abs(b.amount), 0);

const dueSoonBills = bills.filter((b: Bill) => b.dueSoon);
const dueSoonTotal = dueSoonBills.reduce((sum: number, b: Bill) => sum + Math.abs(b.amount), 0);

  return {
    summary: {
      totalBills,
      paid: { count: paidBills.length, amount: paidTotal },
      upcoming: { count: upcomingBills.length, amount: upcomingTotal },
      dueSoon: { count: dueSoonBills.length, amount: dueSoonTotal },
    },
    bills,
  };
};