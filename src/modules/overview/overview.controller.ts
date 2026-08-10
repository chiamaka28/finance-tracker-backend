import type {  Response } from 'express';
import { getOverviewService } from './overview.service';
import type { AuthRequest } from '@/middleware/auth';

export class OverviewController {
  async getOverview (req: AuthRequest, res: Response ) : Promise<void> {
    try {
      const userId = Number(req.user?.id);
    const overview = await getOverviewService(userId);

    res.status(200).json({
        success: true,
        data: overview,
    });
    } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch summary' });
    }
   

 }
}
