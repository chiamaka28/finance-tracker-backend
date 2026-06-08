import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { prisma } from '../../db';
import { parse } from 'csv-parse/sync';
import { Category } from '@generated/prisma/client';

interface CsvRow {
  name: string;
  category: string;
  avatarUrl?: string;
  date: string;
  amount: string;
  recurring: string;
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../data/data.json');


const normalizeCategory = (value: string): Category | null => {
  const normalized = value.toUpperCase().replace(/ /g, '_') as Category;
  return Object.values(Category).includes(normalized) ? normalized : null;
};



export const getAllTransactions = async (
    userId: number,
    category?: Category,
    sortBy?: string,
    search?: string
) => {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const sortOptions: Record<string, object> = {
    latest:  { date: 'desc' },
    oldest:  { date: 'asc' },
    aToZ:    { name: 'asc' },
    zToA:    { name: 'desc' },
    highest: { amount: 'desc' },
    lowest:  { amount: 'asc' },

  };

  const orderBy = sortOptions[sortBy ?? ''] ?? { date: 'desc' };

  const transactions = await prisma.transactions.findMany({where: { userId, ...(category && { category }), ...(search && { name: { contains: search } }), },   orderBy});
  if (transactions.length > 0) {
     return transactions;
  } else {
     const rawData = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(rawData);
  }


 
}

export const importFromCsv = async (buffer: Buffer, userId: number) => {
  const rows = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  const validRows: any[] = [];
  let skipped = 0;

  for (const row of rows) {
    const category = normalizeCategory(row.category);

    if (!category) {
      skipped++;
      continue;
    }

    validRows.push({
      name: row.name,
      category,
      avatarUrl: row.avatarUrl ?? null,
      date: new Date(row.date),
      amount: parseFloat(row.amount),
      recurring: row.recurring === 'true',
      userId,
    });
  }

 const result = await prisma.transactions.createMany({ 
  data: validRows, 
  skipDuplicates: true 
});

return { saved: result.count, skipped };
};