import { Router } from 'express';
import{ TransactionController }  from './transaction.controller.js';
import {upload} from '../../middleware/upload.js';


const TransactionRouter = Router();


const transactionController = new TransactionController();
TransactionRouter.get('/', transactionController.getTransactions.bind(transactionController));
TransactionRouter.post('/import', upload.single('file'), transactionController.importTransactions.bind(transactionController));
export default TransactionRouter;