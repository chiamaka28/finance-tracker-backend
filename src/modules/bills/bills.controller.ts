import type{ Response } from 'express';
import type { AuthRequest } from "@/middleware/auth";
import { getBillsService } from './bills.service';

export class BillController {
    async getBills (req: AuthRequest, res: Response) : Promise<void> {
    try {
                
                const userId = Number(req.user?.id); 
                const search = req.query.search as string | undefined;
                const rawSortBy = req.query.sortBy as string | undefined;
                const sortBy = rawSortBy ?? 'latest';
                const bills = await getBillsService(userId, search, sortBy);
    
    
               res.status(201).json({
                   success: true,
                   message: 'Bills fetched successfully',
                   data: { result: bills},
               });
            } catch (error:any)  {
              console.log(error)
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
}