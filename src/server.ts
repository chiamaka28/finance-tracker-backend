import express, {type Express, type Response} from 'express';
import authRouter from './modules/auth/auth.router';
import TransactionRouter from './modules/transaction/transaction.router';
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
app.use('/api/transactions', authenticate, TransactionRouter);
//Start the server

export default app;