import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getAllTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req as { userId: number };

  try {
    const tickets = await ticketsService.getAllTickets(userId);
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
  try {
    const tickets = await ticketsService.getTicketsTypes();
    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  const { ticketTypeId } = req.body as { ticketTypeId: number };
  const { userId } = req as { userId: number };

  try {
    const ticket = await ticketsService.create({ ticketTypeId, userId });
    return res.status(httpStatus.CREATED).send(ticket);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
