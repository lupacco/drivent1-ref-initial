import { Router } from 'express';
import { getPayment, processPayment } from '@/controllers/payments-controller';
import { authenticateToken, validateBody } from '@/middlewares';
import { paymentSchema } from '@/schemas/payments-schemas';

const paymentsRouter = Router();

paymentsRouter.get('/', authenticateToken, getPayment);
paymentsRouter.post('/process', authenticateToken, validateBody(paymentSchema), processPayment);

export { paymentsRouter };
