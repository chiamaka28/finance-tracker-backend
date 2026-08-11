import { Router } from 'express';
import { BillController } from './bills.controller';

const BillRouter = Router();
const billController = new BillController();
BillRouter.get('/', billController.getBills.bind(billController));
export default BillRouter;