import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotelById, getHotels } from '@/controllers';

const hotelsRouter = Router();

hotelsRouter.get('/', authenticateToken, getHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotelById);

export { hotelsRouter };
