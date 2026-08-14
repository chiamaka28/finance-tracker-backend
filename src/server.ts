import express, {type Express, type Response} from 'express';
import { rateLimit } from 'express-rate-limit';
import authRouter from './modules/auth/auth.router';
import TransactionRouter from './modules/transaction/transaction.router';
import budgetRouter from './modules/budget/budget.router';
import OverviewRouter from './modules/overview/overview.router';
import BillRouter from './modules/bills/bills.router';
import potRouter from './modules/pots/pots.router';
import { authenticate } from  './middleware/auth';
import cors from 'cors';

const app: Express = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Only 5 attempts allowed
  message: 'Too many login attempts. Please try again later.',
});



//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rate-limiting Middleware

app.use(limiter);


//Cors
app.use(cors());
//Authentication Middleware

//Routes
app.get('/', (_req, res: Response) => {
  res.send('Hello, World!');
});
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/overview', authenticate, OverviewRouter);
app.use('/api/transactions', authenticate, TransactionRouter);
app.use('/api/budget', authenticate,  budgetRouter);
app.use('/api/pot', authenticate, potRouter);
app.use('/api/bills', authenticate, BillRouter);
//Start the server

export default app;