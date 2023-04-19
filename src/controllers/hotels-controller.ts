import httpStatus from 'http-status';
import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  try {
    const hotel = {};
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
