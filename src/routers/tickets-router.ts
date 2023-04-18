import { Router } from 'express';
import { createTicket, getAllTickets, getTicketsType } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { createTicketSchema } from '@/schemas/tickets-schema';

const ticketsRouter = Router();

ticketsRouter.get('/', authenticateToken, getAllTickets);
ticketsRouter.get('/types', authenticateToken, getTicketsType);
ticketsRouter.post('/', authenticateToken, validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
