import type {Response} from 'express';
import type {CreatePotDto, UpdatePotAmountDto, UpdatePotDto} from './pots.dto';
import type {AuthRequest} from "@/middleware/auth";
import { createPotService,getPotService, updatePotService, deletePotService, AddPotService, withdrawPotService } from './pots.service';

export class PotsController {
    async createPot(req: AuthRequest, res: Response ) :Promise<void> {
        try {
            const userId = Number(req.user?.id);
            const dto: CreatePotDto = req.body;
            const pot = await createPotService(userId, dto);

            res.status(201).json({
                success: true,
                message: "Pot created successfully",
                data: {result: pot},
            })
        } catch (error: any) {
            console.error('Error creating pot:', error);
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

    async getPot(req: AuthRequest, res: Response) :Promise<void> {
        try {
            const userId = Number (req.user?.id);
            const pot = await getPotService(userId);

            res.status(201).json({
                success: true,
                message: "Pots fetched successfully",
                data: {result: pot}
            })
        } catch (error: any) {
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

    async updatePot(req: AuthRequest, res: Response) :Promise<void> {
        try {
            const userId = Number(req.user?.id);
            const id = Number(req.params.id);
            const dto: UpdatePotDto = req.body;
            const pot = await updatePotService(userId,id, dto);

             res.status(200).json({
            success: true,
            message: 'Pot updated successfully',
            data: { result: pot },
        })
       } catch (error: any) {
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

    async withdrawMoney(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = Number(req.user?.id);
        const id = Number(req.params.id);
        const dto: UpdatePotAmountDto = req.body;
        const pot = await withdrawPotService(userId, id, dto);

        res.status(200).json({
        success: true,
        message: 'Money withdrawn successfully',
        data: { result: pot },
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Bad Request' });
    }
    }

    async addMoney(req: AuthRequest, res: Response): Promise<void> {
    try {
        const userId = Number(req.user?.id);
        const id = Number(req.params.id);
        const dto: UpdatePotAmountDto = req.body;
        const pot = await AddPotService(userId, id, dto);

        res.status(200).json({
        success: true,
        message: 'Money Added successfully',
        data: { result: pot },
        });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message || 'Bad Request' });
    }
    }

    async deletePot(req: AuthRequest, res: Response) :Promise<void> {
        try {
            const userId = Number(req.user?.id);
            const id = Number(req.params.id);
            await deletePotService(userId,id);

           res.status(200).json({
            success: true,
            message: 'Pot deleted successfully',
        })

        } catch (error : any) {
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


