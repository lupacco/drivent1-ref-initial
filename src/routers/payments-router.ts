import { Router } from 'express';
import { getPayment } from '@/controllers/payments-controller';
import { authenticateToken } from '@/middlewares';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, getPayment);
paymentsRouter.post('/process', authenticateToken);

export { paymentsRouter };
