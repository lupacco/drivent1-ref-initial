import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';
import { badRequestError } from '@/errors/bad-request-error';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;
  const { userId } = req as { userId: number };
  try {
    if (!hotelId || hotelId === 'undefined') throw badRequestError();
    const hotel = await hotelsService.getHotelById(Number(hotelId), userId);
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'BadRequestError') return res.sendStatus(httpStatus.BAD_REQUEST);
    if (error.name === 'PaymentRequiredError') return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
  }
}
