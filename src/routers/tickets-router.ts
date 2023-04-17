import { Router } from 'express';
import { createTicket, getAllTickets, getTicketsType } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter.get('/', authenticateToken, getAllTickets);
ticketsRouter.get('/types', authenticateToken, getTicketsType);
ticketsRouter.post('/', authenticateToken, createTicket);

export { ticketsRouter };
