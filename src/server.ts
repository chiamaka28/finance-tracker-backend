import express, {type Express, type Response} from 'express';
import authRouter from './modules/auth/auth.router';
import TransactionRouter from './modules/transaction/transaction.router';
import budgetRouter from './modules/budget/budget.router';
import OverviewRouter from './modules/overview/overview.router';
import BillRouter from './modules/bills/bills.router';
import potRouter from './modules/pots/pots.router';
import { authenticate } from  './middleware/auth';
import cors from 'cors';

const app: Express = express();


//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rate-limiting Middleware
//Cors
app.use(cors());
//Authentication Middleware

//Routes
app.get('/', (req, res: Response) => {
  res.send('Hello, World!');
});
app.use('/api/auth', authRouter);
app.use('/api/overview', authenticate, OverviewRouter);
app.use('/api/transactions', authenticate, TransactionRouter);
app.use('/api/budget', authenticate,  budgetRouter);
app.use('/api/pot', authenticate, potRouter);
app.use('/api/bills', authenticate, BillRouter);
//Start the server

export default app;