import type {  Response } from 'express';
import { getAllTransactions, importFromCsv } from './transaction.service';
import type{ AuthRequest } from '../../middleware/auth';
import type { Category } from '@generated/prisma/client'


export class TransactionController {
  async getTransactions(req: AuthRequest, res: Response) {
    try {
      const userId = Number(req.user?.id);
      const rawCategory = req.query.category as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const category = rawCategory
        ? (rawCategory.toUpperCase().replace(/ /g, '_') as Category)
        : undefined;
      const transactions = await getAllTransactions(userId, category, sortBy);
      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.log('error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
      });
    }
  }

  async importTransactions(req: AuthRequest, res: Response) {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
      return;
    }

    const userId = Number(req.user?.id);
    const result = await importFromCsv(req.file.buffer, userId);

    res.status(200).json({
      success: true,
      data: {
        saved: result.saved,
        skipped: result.skipped,
      },
    });
  } catch (error) {
    console.log('error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import transactions',
    });
  }
}
}

