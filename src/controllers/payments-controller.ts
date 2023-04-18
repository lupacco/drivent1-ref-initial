import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { badRequestError } from '@/errors/bad-request-error';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const { ticketId } = req.query;
  const { userId } = req as { userId: number };
  try {
    if (!ticketId) throw badRequestError();
    const payments = await paymentsService.getPayment(Number(ticketId), userId);
    return res.status(httpStatus.OK).send(payments);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export async function makePayment(req: AuthenticatedRequest, res: Response) {
  try {
    return res.status(httpStatus.OK).send();
  } catch (error) {
    if (error.name === 'NotFoundError') return res.status(httpStatus.NOT_FOUND).send({});
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'UnauthorizedError') return res.sendStatus(httpStatus.UNAUTHORIZED);

    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}
