import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.params;
  const { userId } = req as { userId: number };
  try {
    const payments = paymentsService.getPayment(Number(ticketId), userId);
    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  try {
    return res.status(httpStatus.OK).send();
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
